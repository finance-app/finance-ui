import {combineLatest as observableCombineLatest,  Subject ,  ReplaySubject ,  Observable ,  BehaviorSubject } from 'rxjs';

import { take, skip } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';

// Models
import { Transaction } from './transaction';
import { Currency } from '../currencies/currency';

// Services
import { TransactionsService } from './transactions.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TimeframeService } from '../core/services/timeframe.service';
import { PeriodsService } from '../periods/periods.service';
import { BudgetsService } from '../budgets/budgets.service';

import { Chart } from 'angular-highcharts';
import { Period } from '../periods/period';

import { Index } from '../components/index/index';

import * as _ from 'lodash';
import { TimeframeFilter } from '../core/filters/timeframe-filter';
import { TargetsFilter, TargetsService } from '../targets';
import { AccountsFilter, AccountsService } from '../accounts';

@Component({
  moduleId: module.id,
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})

export class TransactionsComponent extends Index implements OnInit, OnDestroy {

  public transactions: ReplaySubject<Array<Transaction>> = new ReplaySubject<Array<Transaction>>(1);
  public transactionsSum: string = '0';
  public expensesChart: Chart;
  public balancesChart: Chart;
  public currencySymbol: any = '';
  public currentBudget: any;
  public currentPeriod: any;
  public periods: ReplaySubject<Array<Period>> = new ReplaySubject<Array<Period>>(1);
  public defaultPeriod: ReplaySubject<Period> = new ReplaySubject<Period>(1);
  public timeframeFilter: TimeframeFilter;
  public filters: any = [
    {
      title: 'Category',
      property: 'transaction_category_id',
      options: this.transactionCategoriesService.transactionCategories,
      optionValue: function(transactionCategory) { return transactionCategory ? transactionCategory.id : null },
      optionString: function(transactionCategory) { return transactionCategory.name },
      observable: new ReplaySubject<any>(1),
      mobileIcon: 'fa-tags',
    },
    new TargetsFilter(this.targetsService),
    new AccountsFilter(this.accountsService),
    {
      title: 'Type',
      property: 'type',
      options: new BehaviorSubject<Array<string>>(['fixed', 'flexible', 'discretionary']),
      optionString: function(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
      observable: new ReplaySubject<any>(1),
      mobileIcon: 'fa-old-republic',
    },
    {
      title: 'Value',
      property: 'value',
      options: new BehaviorSubject<Array<string>>(['income', 'expense']),
      optionString: function(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
      observable: new ReplaySubject<any>(1),
      mobileIcon: 'fa-exchange-alt',
    }
  ];

  constructor(
    public transactionsService: TransactionsService,
    public transactionCategoriesService: TransactionCategoriesService,
    public timeframeService: TimeframeService,
    public periodsService: PeriodsService,
    public budgetsService: BudgetsService,
    public accountsService: AccountsService,
    public targetsService: TargetsService,
    private cdRef : ChangeDetectorRef,
  ) {
    super();
    this.objects = this.transactions;
    this.objectsService = transactionsService;
    this.timeframeFilter = new TimeframeFilter(timeframeService, periodsService);
    this.filters.push(...this.timeframeFilter.filters);
  }

  getAll(params = []): ReplaySubject<any> {
    let subject = super.getAll(params);
    this.transactions.pipe(take(2)).subscribe(
      transactions => {
        if (transactions.length > 0) {
          this.transactionsSum = transactions.map(t => t.value * (this.transactionsService.isExpense(t) ?  -1 : 1)).reduce((a, b) => a + b).toFixed(2);
        } else {
          this.transactionsSum = '0';
        }
      }
    );
    return subject;
  }

  ngOnInit() {
    super.ngOnInit();

    // Get all transaction categories for filters
    this.transactionCategoriesService.getAll();

    // Subscribe to period changes and request balances per day for it
    this.push(this.timeframeFilter.periodsFilter.observable.subscribe(period => {
      if (period == null) {
        console.error('BUG: null period not supported for getting expenses per day');
      } else if (period != this.currentPeriod) {
        this.updateGraphs(period);
        this.currentPeriod = period;
      }
    }));

    // subscribe to budget changes to update currencySymbol
    this.push(this.timeframeFilter.budgetsFilter.observable.subscribe(budget => {
      if (budget == null) {
        console.error('BUG: null budget not supported.');
      } else {
        this.budgetsService.get(budget.split('=')[1]).subscribe(data => {
          this.currencySymbol = data == null ? '' : data.currency.symbol;
          !this.cdRef['destroyed'] && this.cdRef.detectChanges();
        });
      }
    }));
  }

  update(): ReplaySubject<any> {
    let subject = super.update();
    const period = this.currentParams.find(f => f != null && f.split('=')[0] == 'period_id');
    period && this.updateGraphs(period);
    return subject;
  }

  updateGraphs(period) {
    this.periodsService.expenses_per_day(period.split('=')[1]).subscribe(data => {
      this.expensesChart = new Chart({
        chart: {
          type: 'line'
        },
        credits: {
          enabled: false
        },
        title: {
          text: 'Expenses per day'
        },
        xAxis: {
          categories: data.labels,
        },
        series: data.series,
      });
      !this.cdRef['destroyed'] && this.cdRef.detectChanges();
    });

    let options = new HttpParams({
      fromString: period,
    });

    // pipe(take(1)) to use only first received data (from cache). Ugly, but prevents making 2 requests
    observableCombineLatest(
      this.periodsService.get(period.split('=')[1]),
      this.accountsService.balances(options)
    ).subscribe(([p, balances]) => {
      let current_total = balances.balances.series.find(s => s.name == 'Current Total' || s.name == 'Accounts balance');
      if (current_total) {
        current_total.name = 'Accounts balance';

        let labels = _.union<string>(balances.balances.labels, p.balance_history.labels).sort();

        let series_tmp = {
          'Period balance': _.zipObject(p.balance_history.labels, p.balance_history.series[0].data),
          'Accounts balance':  _.zipObject(balances.balances.labels, balances.balances.series.find(s => s.name == 'Accounts balance').data),
        }

        let series = [];

        for (let serie of Object.keys(series_tmp)) {
          let serie_final = {
            name: serie,
            data: [],
          };

          let data = series_tmp[serie];
          for (let label of labels) {
            serie_final.data.push(data[label] || null);
          }
          series.push(serie_final);
        }

        this.balancesChart = new Chart({
          chart: {
            type: 'line'
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              connectNulls: true,
            },
          },
          title: {
            text: 'Period and accounts balances per day'
          },
          xAxis: {
            categories: labels,
          },
          series: series,
        });
      } else {
        this.balancesChart = new Chart({
          chart: {
            type: 'line'
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            series: {
              connectNulls: true,
            },
          },
          title: {
            text: 'Period and accounts balances per day'
          },
          xAxis: {
            categories: p.balance_history.labels,
          },
          series: p.balance_history.series
        });
      }
      !this.cdRef['destroyed'] && this.cdRef.detectChanges();
    });
  }
}
