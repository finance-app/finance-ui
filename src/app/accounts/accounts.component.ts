import { Component, OnInit, Optional, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AccountsComponentCommon } from './accounts.component.common';
import { ReplaySubject } from 'rxjs';

// Services
import { AccountsService } from './accounts.service';
import { CurrenciesService } from '@app/currencies';
import { TimeframeService } from '../core/services/timeframe.service';
import { PeriodsService } from '@app/periods';

import { Chart } from 'angular-highcharts';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})

export class AccountsComponent extends AccountsComponentCommon implements OnInit, OnDestroy {

  public balancesChart: Chart;

  constructor(
    public accountsService: AccountsService,
    public currenciesService: CurrenciesService,
    public timeframeService: TimeframeService,
    public periodsService: PeriodsService,
    private cdRef: ChangeDetectorRef,
  ) {
    super(
      accountsService,
      currenciesService,
      timeframeService,
      periodsService,
    );
  }

  getAll(params = []): ReplaySubject<any> {
    const subject = super.getAll(params);

    // build all query params
    const options = super.options(params);

    this.accountsService.balances(options).subscribe(
      balances => {
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
              text: 'Account balances over time'
            },
            xAxis: {
              categories: balances.balances.labels
            },
            series: balances.balances.series
        });

        this.cdRef.detectChanges();
      }
    );
    return subject;
  }
}
