import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { Currency } from './currency';
import { CurrenciesService } from './currencies.service';

export class CurrenciesFilter {

  public title: string = 'Currency';
  public property: string = 'currency_id';
  public mobileIcon: string = 'fa-dollar-sign';
  public options: ReplaySubject<Array<Currency>>;
  public observable: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    public currenciesService: CurrenciesService,
    public defaultObservable?: BehaviorSubject<any>,
    public defaultObject?: any,
  ) {
    this.options = this.currenciesService.currencies;
    this.currenciesService.getAll();
  }

  public optionValue(currency) {
    return currency ? currency.id : null;
  }

  public optionString(currency) {
    return currency.name;
  }
}
