
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  Subject ,  ReplaySubject } from 'rxjs';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';

// Models
import { TransactionCategory } from './transaction-category';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class TransactionCategoriesService {

  public _transactionCategories: Array<TransactionCategory> = [];
  public transactionCategories: ReplaySubject<Array<TransactionCategory>> = new ReplaySubject<Array<TransactionCategory>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private modalService: ModalService,
  ) {}

  getAll(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/transaction_categories', params).pipe(
      map(res => <TransactionCategory[]> res.body))
      .subscribe(
        transactionCategories => {
          subject.next(transactionCategories);
          if (params == undefined) {
            this._transactionCategories = transactionCategories;
            this.transactionCategories.next(this._transactionCategories);
          }
        },
        error => {
          this.alertsService.addAlert('transaction_categories_fetch', 'danger', 'Failed to fetch transaction categories!');
          subject.error(error);
        }
    );

    return subject;
  }

  create(transactionCategory: TransactionCategory) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/transaction_categories', transactionCategory).pipe(
      map(res => <TransactionCategory> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('transaction_category_create', 'success', 'Succesfully created transaction category ' + data.name + '.');
          this.getAll();
        },
        error => {
          this.alertsService.addAlert('transaction_category_create', 'danger', 'Failed to create transaction category!');
          subject.error(error);
        },
    );

    return subject;
  }

  delete(transactionCategory: TransactionCategory) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: transactionCategory.name,
      action: 'delete',
      objectType: 'Transaction Category',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/transaction_categories/' + transactionCategory.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            const index: number = this._transactionCategories.indexOf(transactionCategory, 0);
            this._transactionCategories.splice(index, 1);
            this.transactionCategories.next(this._transactionCategories);
            subject.next(data);
            this.alertsService.addAlert('transaction_category_delete', 'success', 'Succesfully removed transaction category ' + transactionCategory.name + '!');
          },
          error => {
            this.alertsService.addAlert('transaction_category_delete', 'danger', 'Failed to delete transaction category ' + transactionCategory.name + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(transactionCategory: TransactionCategory) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/transaction_categories/' + transactionCategory.id, transactionCategory).pipe(
      map(res => <TransactionCategory> res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('transaction_category_update', 'success', 'Succesfully updated transaction category ' + transactionCategory.name + '.');
        },
        error => {
          this.alertsService.addAlert('transaction_category_update', 'danger', 'Failed to update transaction category!');
          subject.error(error);
        },
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/transaction_categories/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('transaction_category_get', 'danger', 'Failed to fetch transaction categories!');
          subject.error(error);
        }
    );

    return subject;
  }
}
