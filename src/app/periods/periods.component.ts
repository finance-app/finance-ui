import { ReplaySubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Models
import { Period } from './period';
import { Currency } from '../currencies/currency';

// Services
import { PeriodsService } from './periods.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TimeframeService } from '../core/services/timeframe.service';

import { IndexDirective } from '../components/index/index';
import { BudgetsFilter } from '../budgets/budgets-filter';

@Component({
  selector: 'periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.css'],
})

export class PeriodsComponent extends IndexDirective implements OnInit, OnDestroy {

  public periods: ReplaySubject<Array<Period>> = new ReplaySubject<Array<Period>>(1);
  public filters: any = [
    new BudgetsFilter(this.timeframeService),
  ];

  constructor(
    public periodsService: PeriodsService,
    public currenciesService: CurrenciesService,
    public timeframeService: TimeframeService,
  ) {
    super();
    this.objects = this.periods;
    this.objectsService = periodsService;
  }
}
