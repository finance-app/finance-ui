import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Component, OnInit, Optional, OnDestroy, Directive } from '@angular/core';

// Models
import { Account } from './account';

// Services
import { AccountsService } from './accounts.service';
import { CurrenciesService } from '../currencies';
import { TimeframeService } from '../core/services/timeframe.service';
import { PeriodsService } from '../periods';

import { IndexDirective } from '../components/index/index';

import { TimeframeFilter } from '../core/filters/timeframe-filter';
import { CurrenciesFilter } from '../currencies';

@Directive()
export class AccountsComponentCommon extends IndexDirective implements OnInit, OnDestroy {

  public accounts: ReplaySubject<Array<Account>> = new ReplaySubject<Array<Account>>(1);
  public filters: any = [
    new CurrenciesFilter(this.currenciesService, this.timeframeService.currentBudget, function(budget) { return budget ? budget.currency : null }),
    {
      title: 'Type',
      property: 'type',
      options: new BehaviorSubject<Array<string>>(['current', 'savings']),
      optionString: function(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
      defaultObservable: new BehaviorSubject<string>('current'),
      observable: new ReplaySubject<any>(1),
      mobileIcon: 'fa-piggy-bank',
    },
    ...(new TimeframeFilter(this.timeframeService, this.periodsService).filters),
  ];

  constructor(
    public accountsService: AccountsService,
    public currenciesService: CurrenciesService,
    public timeframeService: TimeframeService,
    public periodsService: PeriodsService,
  ) {
    super();
    this.objects = this.accounts;
    this.objectsService = accountsService;
  }
}
