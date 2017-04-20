
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';
import { Observable, Subject ,  ReplaySubject } from 'rxjs';

// Models
import { Target } from './target';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class TargetsService {

  public _targets: Array<Target> = [];
  public targets: ReplaySubject<Array<Target>> = new ReplaySubject<Array<Target>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private modalService: ModalService,
  ) { }

  getAll(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/targets', params).pipe(
      map(res => <Target[]> res.body))
      .subscribe(
        targets => {
          subject.next(targets);
          if (params == undefined) {
            this._targets = targets;
            this.targets.next(this._targets);
          }
        },
        error => {
          this.alertsService.addAlert('targets_fetch', 'danger', 'Failed to fetch targets!');
          subject.error(error);
        }
    );

    return subject;
  }

  create(target: Target) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/targets', target).pipe(
      map(res => <Target> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('target_create', 'success', 'Succesfully created target ' + data.name + '.');
          this.getAll();
        },
        error => {
          this.alertsService.addAlert('target_create', 'danger', 'Failed to create target!');
          subject.error(error);
        },
    );

    return subject;
  }

  delete(target: Target) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: target.name,
      action: 'delete',
      objectType: 'target',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/targets/' + target.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            const index: number = this._targets.indexOf(target, 0);
            this._targets.splice(index, 1);
            subject.next(data);
            this.targets.next(this._targets);
            this.alertsService.addAlert('target_delete', 'success', 'Succesfully removed target ' + target.name + '!');
          },
          error => {
            this.alertsService.addAlert('target_delete', 'danger', 'Failed to delete target ' + target.name + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(target: Target) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/targets/' + target.id, target).pipe(
      map(res => <Target> res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('target_update', 'success', 'Succesfully updated target ' + target.name + '.');
        },
        error => {
          this.alertsService.addAlert('target_update', 'danger', 'Failed to update target!');
          subject.error(error);
        },
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/targets/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('target_get', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }

  edit(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/targets/' + id + '/edit').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('target_get', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }

  favourite(target: Target, favourite: boolean) {
    target.favourite = favourite;
    const subject = new ReplaySubject<any>(1);
    this.api.put('/targets/' + target.id, target).pipe(
      map(res => <Target> res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('target_favourite', 'success', 'Succesfully added target ' + target.name + ' to Favourites.');
        },
        error => {
          this.alertsService.addAlert('target_favourite', 'danger', 'Failed to add target to Favourites!');
          subject.error(error);
        },
    );

    return subject;
  }
}
