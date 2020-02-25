import { Component, OnInit, Optional, OnDestroy } from '@angular/core';
import { AccountsComponentCommon } from './accounts.component.common';

// Services
import { AccountsService } from './accounts.service';
import { CurrenciesService } from '../currencies';
import { TimeframeService } from '../core/services/timeframe.service';
import { PeriodsService } from '../periods';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})

export class AccountsComponent extends AccountsComponentCommon implements OnInit, OnDestroy {

  constructor(
    public accountsService: AccountsService,
    public currenciesService: CurrenciesService,
    public timeframeService: TimeframeService,
    public periodsService: PeriodsService,
  ) {
    super(
      accountsService,
      currenciesService,
      timeframeService,
      periodsService,
    );
  }
}
