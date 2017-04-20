
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  Subject ,  ReplaySubject } from 'rxjs';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';


// Models
import { Budget } from './budget';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { SessionService } from '../core/services/session.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class BudgetsService {

  public _budgets: Array<Budget> = [];
  public budgets: ReplaySubject<Array<Budget>> = new ReplaySubject<Array<Budget>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private sessionService: SessionService,
    private modalService: ModalService,
  ) {
    this.sessionService.sessionStatus.subscribe(sessionStatus => {
      if (!sessionStatus) {
        this._budgets = [];
        this.budgets.next(this._budgets);
      }
    });
  }

  getAll(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/budgets', params).pipe(
      map(res => <Budget[]> res.body), finalize(() => subject.complete()), )
      .subscribe(
        budgets => {
          subject.next(budgets);
          if (params == undefined) {
            this._budgets = budgets;
            this.budgets.next(budgets);
          }
        },
        error => {
          this.alertsService.addAlert('budgets_fetch', 'danger', 'Failed to fetch budgets!');
          subject.error(error);
        }
    );

    return subject;
  }

  create(budget: Budget) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/budgets', budget).pipe(
      map(res => <Budget> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('budget_create', 'success', 'Succesfully created budget ' + data.name + '.');
          this._budgets.push(data);
          this.budgets.next(this._budgets);
        },
        error => {
          this.alertsService.addAlert('budget_create', 'danger', 'Failed to create budget!');
          subject.error(error);
        },
    );

    return subject;
  }

  delete(budget: Budget) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: budget.name,
      action: 'delete',
      objectType: 'budget',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/budgets/' + budget.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            subject.next(data);
            this.alertsService.addAlert('budget_delete', 'success', 'Succesfully removed budget ' + budget.name + '!');
            const index = this._budgets.indexOf(budget);
            this._budgets.splice(index, 1);
            this.budgets.next(this._budgets);
          },
          error => {
            this.alertsService.addAlert('budget_delete', 'danger', 'Failed to delete budget ' + budget.name + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(budget: Budget) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/budgets/' + budget.id, budget).pipe(
      map(res => <Budget> res.body))
      .subscribe(
        data => {
          subject.next(data);
          const index = this._budgets.indexOf(this._budgets.find(b => b.id == budget.id));
          this._budgets[index] = data;
          this.budgets.next(this._budgets);
          this.alertsService.addAlert('budget_update', 'success', 'Succesfully updated budget ' + budget.name + '.');
        },
        error => {
          this.alertsService.addAlert('budget_update', 'danger', 'Failed to update budget!');
          subject.error(error);
        },
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/budgets/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('budget_get', 'danger', 'Failed to fetch budget!');
          subject.error(error);
        }
    );

    return subject;
  }

  edit(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/budgets/' + id + '/edit').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('budget_get', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }
}
