import { ReplaySubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Models
import { TransactionCategory } from './transaction-category';

// Services
import { TransactionCategoriesService } from './transaction-categories.service';
import { TimeframeService } from '../core/services/timeframe.service';
import { PeriodsService } from '../periods/periods.service';

import { IndexDirective } from '../components/index/index';
import { TimeframeFilter } from '../core/filters/timeframe-filter';

@Component({
  selector: 'transaction-categories',
  templateUrl: './transaction-categories.component.html',
  styleUrls: ['./transaction-categories.component.css'],
})

export class TransactionCategoriesComponent extends IndexDirective implements OnInit, OnDestroy {

  public transactionCategories: ReplaySubject<Array<TransactionCategory>> = new ReplaySubject<Array<TransactionCategory>>(1);
  public filters: Array<any> = [
    ...(new TimeframeFilter(this.timeframeService, this.periodsService).filters),
  ];

  constructor(
    public transactionCategoriesService: TransactionCategoriesService,
    public timeframeService: TimeframeService,
    private periodsService: PeriodsService,
  ) {
    super();
    this.objects = this.transactionCategories;
    this.objectsService = transactionCategoriesService;
  }
}
