
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Subject ,  ReplaySubject } from 'rxjs';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';

// Models
import { Currency } from './currency';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class CurrenciesService {

  public _currencies: Array<Currency> = [];
  public currencies: ReplaySubject<Array<Currency>> = new ReplaySubject<Array<Currency>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private modalService: ModalService,
  ) {
    this.getAll();
  }

  getAll() {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/currencies').pipe(
      map(res => <Currency[]> res.body))
      .subscribe(
        currencies => {
          this._currencies = currencies;
          subject.next(currencies);
          this.currencies.next(this._currencies);
        },
        error => {
          this.alertsService.addAlert('currencies_fetch', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/currencies/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('currency_get', 'danger', 'Failed to fetch currency!');
          subject.error(error);
        });

    return subject;
  }

  edit(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/currencies/' + id + '/edit').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('currency_get', 'danger', 'Failed to fetch currency!');
          subject.error(error);
        });

    return subject;
  }

  budgets(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/currencies/' + id + '/budgets').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('currency_budgets', 'danger', 'Failed to fetch budgets for currency id: ' + id + ' !');
          subject.error(error);
        });

    return subject;
  }

  create(currency: Currency) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/currencies', currency).pipe(
      map(res => <Currency> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('currency_create', 'success', 'Succesfully created currency ' + data.name + '.');
          this._currencies.push(currency);
          this.currencies.next(this._currencies);
        },
        error => {
          this.alertsService.addAlert('currency_create', 'danger', 'Failed to create currency!');
          subject.error(error);
        }
    );

    return subject;
  }

  delete(currency: Currency) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: currency.name,
      action: 'delete',
      objectType: 'currency',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/currencies/' + currency.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            const index: number = this._currencies.indexOf(currency, 0);
            this._currencies.splice(index, 1);
            subject.next(data);
            this.currencies.next(this._currencies);
            this.alertsService.addAlert('currency_delete', 'success', 'Succesfully removed currency ' + currency.name + '!');
          },
          error => {
            this.alertsService.addAlert('currency_delete', 'danger', 'Failed to delete currency ' + currency.name + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(currency: Currency) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/currencies/' + currency.id, currency).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('currency_update', 'success', 'Succesfully updated currency ' + currency.name + '.');
        },
        error => {
          this.alertsService.addAlert('currency_update', 'danger', 'Failed to update currency!');
          subject.error(error);
        }
    );

    return subject;
  }
}
