import { ReplaySubject } from 'rxjs';
import { Account } from './account';
import { AccountsService } from './accounts.service';

export class AccountsFilter {

  public title: string = 'Account';
  public property: string = 'account_id';
  public mobileIcon: string = 'fa-piggy-bank';
  public options: ReplaySubject<Array<Account>> = new ReplaySubject<Array<Account>>(1);
  public observable: ReplaySubject<any> = new ReplaySubject<any>(1);
  public subscriptions: any = [];

  constructor(
    public accountsService: AccountsService,
  ) {
    this.subscriptions.push(accountsService.accounts.subscribe(accounts => {
      this.options.next(accounts);
    }));
    accountsService.getAll();
  }

  public optionValue(account) {
    return account ? account.id : null;
  }

  public optionString(account) {
    return account.name + ' (' + account.currency.name + ')';
  }

  public defaultObject(account) {
    return account || null;
  }
}
