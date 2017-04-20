
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';
import { Observable, Subject ,  ReplaySubject } from 'rxjs';


// Models
import { Period } from './period';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { SessionService } from '../core/services/session.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class PeriodsService {

  public _periods: Array<Period> = [];
  public periods: ReplaySubject<Array<Period>> = new ReplaySubject<Array<Period>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private sessionService: SessionService,
    private modalService: ModalService,
  ) {
    this.sessionService.sessionStatus.subscribe(sessionStatus => {
      if (!sessionStatus) {
        this._periods = [];
        this.periods.next(this._periods);
      }
    });
  }

  getAll(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/periods', params).pipe(
      map(res => <Period[]> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        periods => {
          subject.next(periods);
          if (params == undefined) {
            this._periods = periods;
            this.periods.next(this._periods);
          }
        },
        error => {
          this.alertsService.addAlert('periods_fetch', 'danger', 'Failed to fetch periods!');
          subject.error(error);
        }
    );

    return subject;
  }

  create(period: Period) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/periods', period).pipe(
      map(res => <Period> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('period_create', 'success', 'Succesfully created period ' + data.name + '.');
          this._periods.push(data);
          this.periods.next(this._periods);
        },
        error => {
          this.alertsService.addAlert('period_create', 'danger', 'Failed to create period!');
          subject.error(error);
        },
    );

    return subject;
  }

  close(period: Period) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/periods/' + period.id + '/close', {}).pipe(
      map(res => <Period> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('period_create', 'success', 'Succesfully closed period ' + period.name + '.');
          const index: number = this._periods.indexOf(period, 0);
          this._periods[index] = data;
          this.periods.next(this._periods);
        },
        error => {
          this.alertsService.addAlert('period_create', 'danger', 'Failed to close period!');
          subject.error(error);
        },
    );

    return subject;
  }

  reopen(period: Period) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/periods/' + period.id + '/reopen', {}).pipe(
      map(res => <Period> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('period_create', 'success', 'Succesfully reopened period ' + period.name + '.');
          const index = this._periods.indexOf(period, 0);
          this._periods[index] = data;
          this.periods.next(this._periods);
        },
        error => {
          this.alertsService.addAlert('period_create', 'danger', 'Failed to reopen period!');
          subject.error(error);
        },
    );

    return subject;
  }

  cycle(period: Period) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/periods/' + period.id + '/cycle', {}).pipe(
      map(res => res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          // API returns newly created period first, then updated cycled one
          this.alertsService.addAlert('period_create', 'success', 'Succesfully cycled period ' + period.name + '.');

          // Update cycled period
          const index = this._periods.indexOf(period, 0);
          this._periods[index] = data[1];

          // Push newly created period
          this._periods.push(data[0]);

          this.periods.next(this._periods);
        },
        error => {
          this.alertsService.addAlert('period_create', 'danger', 'Failed to cycle period!');
          subject.error(error);
        },
    );

    return subject;
  }

  delete(period: Period) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: period.name,
      action: 'delete',
      objectType: 'period',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/periods/' + period.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            subject.next(data);
            this.alertsService.addAlert('period_delete', 'success', 'Succesfully removed period ' + period.name + '!');
            const index = this._periods.indexOf(period);
            this._periods.splice(index, 1);
            this.periods.next(this._periods);
          },
          error => {
            this.alertsService.addAlert('period_delete', 'danger', 'Failed to delete period ' + period.name + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(period: Period) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/periods/' + period.id, period).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('period_update', 'success', 'Succesfully updated period ' + period.name + '.');
        },
        error => {
          this.alertsService.addAlert('period_update', 'danger', 'Failed to update period!');
          subject.error(error);
        },
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/periods/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('period_get', 'danger', 'Failed to fetch period!');
          subject.error(error);
        }
    );

    return subject;
  }

  edit(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/periods/' + id + '/edit').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('period_get', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }

  expenses_per_day(id) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/periods/' + (id ? (id + '/') : '') + 'expenses').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('period_get', 'danger', 'Failed to fetch period expenses per day!');
          subject.error(error);
        }
    );

    return subject;
  }
}
