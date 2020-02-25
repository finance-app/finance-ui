import { combineLatest as observableCombineLatest, Observable , ReplaySubject } from 'rxjs';

import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Models
import { Target } from './target';
import { Currency } from '../currencies/currency';
import { Period } from '../periods/period';

// Services
import { TargetsService } from './targets.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TimeframeService } from '../core/services/timeframe.service';
import { PeriodsService } from '../periods/periods.service';

import { Index } from '../components/index/index';
import { TimeframeFilter } from '../core/filters/timeframe-filter';

@Component({
  selector: 'targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.css'],
})

export class TargetsComponent extends Index implements OnInit, OnDestroy {

  public targets: ReplaySubject<Array<Target>> = new ReplaySubject<Array<Target>>(1);
  public periods: ReplaySubject<Array<Period>> = new ReplaySubject<Array<Period>>(1);
  public defaultPeriod: ReplaySubject<Period> = new ReplaySubject<Period>(1);
  public filters: any = [
    {
      title: 'Income category',
      property: 'default_income_transaction_category_id',
      options: this.transactionCategoriesService.transactionCategories,
      optionValue: function(transactionCategory) { return transactionCategory ? transactionCategory.id : null },
      optionString: function(transactionCategory) { return transactionCategory.name },
      observable: new ReplaySubject<any>(1),
      mobileIcon: 'fa-tags',
    },
    {
      title: 'Expense category',
      property: 'default_expense_transaction_category_id',
      options: this.transactionCategoriesService.transactionCategories,
      optionValue: function(transactionCategory) { return transactionCategory ? transactionCategory.id : null },
      optionString: function(transactionCategory) { return transactionCategory.name },
      observable: new ReplaySubject<any>(1),
      mobileIcon: 'fa-tags',
    },
    ...(new TimeframeFilter(this.timeframeService, this.periodsService).filters),
  ];

  constructor(
    public targetsService: TargetsService,
    public transactionCategoriesService: TransactionCategoriesService,
    public timeframeService: TimeframeService,
    public periodsService: PeriodsService,
  ) {
    super();
    this.objects = this.targets;
    this.objectsService = targetsService;
  }

  ngOnInit() {
    super.ngOnInit();
    this.transactionCategoriesService.getAll();
  }
}
