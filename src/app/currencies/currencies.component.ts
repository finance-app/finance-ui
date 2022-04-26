import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { Currency } from './currency';

// Services
import { CurrenciesService } from './currencies.service';

import { IndexDirective } from '../components/index/index';

@Component({
  selector: 'currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css'],
})

export class CurrenciesComponent extends IndexDirective implements OnInit {

  public currencies: ReplaySubject<Array<Currency>> = new ReplaySubject<Array<Currency>>(1);
  public filters = [];

  constructor(
    public currenciesService: CurrenciesService,
  ) {
    super();
    this.objects = this.currencies;
    this.objectsService = currenciesService;
  }
}
