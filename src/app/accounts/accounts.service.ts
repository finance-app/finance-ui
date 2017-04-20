
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '../core/confirmation-modal/confirmation-modal.component';
import { Subject ,  ReplaySubject ,  Observable } from 'rxjs';

// Models
import { Account } from './account';

// Services
import { FinanceApiService } from '../core/services/finance-api.service';
import { AlertsService } from '../core/alerts/alerts.service';
import { ModalService } from '../core/services/modal.service';

@Injectable()
export class AccountsService {

  public _accounts: Array<Account> = [];
  public accounts: ReplaySubject<Array<Account>> = new ReplaySubject<Array<Account>>(1);

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private modalService: ModalService,
  ) {}

  getAll(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/accounts', params).pipe(
      map(res => <Account[]> res.body))
      .subscribe(
        accounts => {
          subject.next(accounts);
          if (params == undefined) {
            this._accounts = accounts;
            this.accounts.next(this._accounts);
          }
        },
        error => {
          this.alertsService.addAlert('accounts_fetch', 'danger', 'Failed to fetch accounts!');
          subject.error(error);
        }
    );

    return subject;
  }

  create(account: Account) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/accounts', account).pipe(
      map(res => <Account> res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('account_create', 'success', 'Succesfully created account ' + data.name + '.');
          this.getAll();
        },
        error => {
          this.alertsService.addAlert('account_create', 'danger', 'Failed to create account!');
          subject.error(error);
        },
    );

    return subject;
  }

  delete(account: Account) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.settings = {
      name: account.name,
      action: 'delete',
      objectType: 'account',
      confirmText: 'Yes, delete!',
      buttonType: 'danger',
    };

    const subject = new ReplaySubject<any>(1);

    modalRef.result.then((close) => {
      this.api.delete('/accounts/' + account.id).pipe(
        map(res => res.body))
        .subscribe(
          data => {
            const index: number = this._accounts.indexOf(account, 0);
            this._accounts.splice(index, 1);
            subject.next(data);
            this.accounts.next(this._accounts);
            this.alertsService.addAlert('account_delete', 'success', 'Succesfully removed account ' + account.name + '!');
          },
          error => {
            this.alertsService.addAlert('account_delete', 'danger', 'Failed to delete account ' + account.name + '.');
            subject.error(error);
          }
      );
    }, (dismiss) => null);

    return subject;
  }

  update(account: Account) {
    const subject = new ReplaySubject<any>(1);
    this.api.put('/accounts/' + account.id, account).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('account_update', 'success', 'Succesfully updated account ' + account.name + '.');
        },
        error => {
          this.alertsService.addAlert('account_update', 'danger', 'Failed to update account!');
          subject.error(error);
        },
    );

    return subject;
  }

  get(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/accounts/' + id).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('account_get', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }

  edit(id: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/accounts/' + id + '/edit').pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('account_get', 'danger', 'Failed to fetch currencies!');
          subject.error(error);
        }
    );

    return subject;
  }

  correct(id: number, date: string, value: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/accounts/' + id + '/correct', {date: date, value: value}).pipe(
      map(res => res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('account_update', 'success', 'Succesfully corrected account balance.');
        },
        error => {
          this.alertsService.addAlert('account_update', 'danger', 'Failed to correct account balance!');
          subject.error(error);
        },
    );

    return subject;
  }

  balances(params = undefined) {
    const subject = new ReplaySubject<any>(1);
    this.api.get('/accounts/balances', params).pipe(
      map(res => res.body))
      .subscribe(
        data => {
          subject.next(data);
        },
        error => {
          this.alertsService.addAlert('account_get', 'danger', 'Failed to fetch accounts balances!');
          subject.error(error);
        }
    );

    return subject;
  }

  transfer(source_id: number, destination_id: number, date: string, value: number) {
    const subject = new ReplaySubject<any>(1);
    this.api.post('/accounts/transfer', {source_id: source_id, destination_id: destination_id, date: date, value: value}).pipe(
      map(res => res.body),
      finalize(() => subject.complete()), )
      .subscribe(
        data => {
          subject.next(data);
          this.alertsService.addAlert('account_transfer', 'success', 'Succesfully created transfer.');
        },
        error => {
          this.alertsService.addAlert('account_transfer', 'danger', 'Failed to create transfer!');
          subject.error(error);
        },
    );

    return subject;
  }
}
