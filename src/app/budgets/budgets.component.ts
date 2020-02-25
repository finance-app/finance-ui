import { ReplaySubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Models
import { Budget } from './budget';

// Services
import { BudgetsService } from './budgets.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TimeframeService } from '../core/services/timeframe.service';

import { Index } from '../components/index/index';

import { CurrenciesFilter } from '../currencies/currencies-filter';

@Component({
  selector: 'budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})

export class BudgetsComponent extends Index implements OnInit, OnDestroy {

  public budgets: ReplaySubject<Array<Budget>> = new ReplaySubject<Array<Budget>>(1);

  public filters: any = [
    new CurrenciesFilter(this.currenciesService),
  ];

  constructor(
    public budgetsService: BudgetsService,
    public timeframeService: TimeframeService,
    public currenciesService: CurrenciesService,
  ) {
    super();
    this.objects = this.budgets;
    this.objectsService = budgetsService;
  }
}
