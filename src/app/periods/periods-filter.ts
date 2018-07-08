import { ReplaySubject } from 'rxjs';
import { Period } from './period';
import { TimeframeService } from '../core/services/timeframe.service';

export class PeriodsFilter {

  public title: string = 'Period';
  public property: string = 'period_id';
  public observable: ReplaySubject<any> = new ReplaySubject<any>(1);
  public current: any;

  constructor(
    public timeframeService: TimeframeService,
    public options?: ReplaySubject<Array<Period>>,
    public defaultObservable?: ReplaySubject<Period>,
  ) {
    this.options = options || timeframeService.periods;
    this.defaultObservable = defaultObservable || timeframeService.currentPeriod;
  }

  public optionValue(period) {
    return period ? period.id : '';
  }

  public optionString(period) {
    return period.name;
  }

  public defaultObject(period) {
    return period || null;
  }
}
