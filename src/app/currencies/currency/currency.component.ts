import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

// Models
import { Currency } from '../currency';
import { Budget } from '../../budgets';
import { Account } from '../../accounts';

// Services
import { CurrenciesService } from '../../currencies';
import { LocationService } from '../../core';

@Component({
  moduleId: module.id,
  selector: 'currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  public currency: ReplaySubject<Currency> = new ReplaySubject<Currency>(1);
  public budgets: ReplaySubject<Array<Budget>> = new ReplaySubject<Array<any>>(1);
  public accounts: ReplaySubject<Array<Account>> = new ReplaySubject<Array<Account>>(1);
  constructor(
    public currenciesService: CurrenciesService,
    private locationService: LocationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currenciesService.get(params['id']).subscribe(
        currency => {
          this.currency.next(currency);
          this.budgets.next(currency.budgets);
          this.accounts.next(currency.accounts);
          this.locationService.setTitle('Currency ' + currency.name);
        },
      );
    });
  }

  delete(currency: Currency) {
    this.currenciesService.delete(currency).subscribe(
      data => {
        this.locationService.back();
      }
    );
  }
}
