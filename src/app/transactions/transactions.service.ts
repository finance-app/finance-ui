
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';
import { Observable, Subject ,  ReplaySubject } from 'rxjs';

// Models
import { Transaction } from './transaction';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class TransactionsService {

  public _transactions: Array<Transaction> = [];
  public transactions: ReplaySubject<Array<Transaction>> = new ReplaySubject<Array<Transaction>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private modalService: ModalService,
  ) { }

  name(transaction: Transaction) {
    return transaction.value + (transaction.source ? (' from ' + transaction.source.name) : '') + (transaction.destination ? (' to ' + transaction.destination.name) : '') + ' on ' + transaction.date;
  }

  isExpense(transaction: Transaction): boolean {
    return (transaction.destination && transaction.destination.model_name == 'Target') || (transaction.source && transaction.source.model_name == 'Account');
  }

  getAll(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/transactions', params).pipe(
      map(res => <Transaction[]> res.body))
      .subscribe(
        transactions => {
          subject.next(transactions);
          if (params == undefined) {
            this._transactions = transactions;
            this.transactions.next(this._transactions);
          }
        },
        error => {
          this.alertsService.addAlert('transactions_fetch', 'danger', 'Failed to fetch transactions!');
          subject.error(error);
        }
    );

    return subject;
  }

  create(transaction: Transaction) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/transactions', transaction).pipe(
      map(res => <Transaction> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('transaction_create', 'success', 'Succesfully created transaction ' + this.name(data) + '.');
          this._transactions.push(data);
          this.transactions.next(this._transactions);
        },
        error => {
          this.alertsService.addAlert('transaction_create', 'danger', 'Failed to create transaction!');
          subject.error(error);
        },
    );

    return subject;
  }

  delete(transaction: Transaction) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: this.name(transaction),
      action: 'delete',
      objectType: 'transaction',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/transactions/' + transaction.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            const index: number = this._transactions.indexOf(transaction, 0);
            this._transactions.splice(index, 1);
            subject.next(data);
            this.transactions.next(this._transactions);
            this.alertsService.addAlert('transaction_delete', 'success', 'Succesfully removed transaction ' + this.name(transaction) + '!');
          },
          error => {
            this.alertsService.addAlert('transaction_delete', 'danger', 'Failed to delete transaction ' + this.name(transaction) + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(transaction: Transaction) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/transactions/' + transaction.id, transaction).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('transaction_update', 'success', 'Succesfully updated transaction ' + this.name(transaction) + '.');
        },
        error => {
          this.alertsService.addAlert('transaction_update', 'danger', 'Failed to update transaction!');
          subject.error(error);
        },
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/transactions/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('transaction_get', 'danger', 'Failed to fetch transactions!');
          subject.error(error);
        }
    );

    return subject;
  }

  edit(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/transactions/' + id + '/edit').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('transaction_get', 'danger', 'Failed to fetch transactions!');
          subject.error(error);
        }
    );

    return subject;
  }
}
