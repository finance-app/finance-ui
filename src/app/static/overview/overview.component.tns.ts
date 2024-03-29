
import {map} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FinanceApiService } from '../../core/services/finance-api.service';
import { AlertsService } from '../../core/alerts/alerts.service';
import { SessionService } from '../../core/services/session.service';
import { TimeframeService } from '../../core/services/timeframe.service';
import { AccountsService } from '../../accounts/accounts.service';

import * as app from '@nativescript/core/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public data: any = {};
  public period: any;
  public accounts: any = {};

  constructor(
    private apiService: FinanceApiService,
    private alertsService: AlertsService,
    private timeframeService: TimeframeService,
    private accountsService: AccountsService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.timeframeService.currentPeriod.subscribe(period => {
      if (period == null) {
        console.error('BUG: null period as current not supported.');
      } else {
        this.period = period;
        this.apiService.get('/overview?period_id=' + period.id).pipe(
          map(res => res.body))
          .subscribe(
            data => {
              this.data = data;
            },
            error => {
              this.alertsService.addAlert('overview_fetch', 'danger', 'Failed to fetch overview data!');
              console.error(error);
            }
        );

        this.accountsService.balances('period_id=' + period.id + '&currency_id=' + period.budget.currency.id).subscribe(balances => {
          const current_total = balances.balances.series.find(s => s.name == 'Current Total');
          const savings_total = balances.balances.series.find(s => s.name == 'Savings Total');
          this.accounts.balance_total = current_total ? current_total.data[current_total.data.length - 1] : 0;
          this.accounts.savings_total = savings_total ? savings_total.data[savings_total.data.length - 1] : 0;
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((elem) => { elem.unsubscribe(); })
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
