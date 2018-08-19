import { Subscription, ReplaySubject, BehaviorSubject } from 'rxjs';
import { skip, take, finalize } from 'rxjs/operators';
import { Period } from '../../periods/period';
import { TimeframeService } from '../services/timeframe.service';
import { PeriodsService } from '../../periods/periods.service';
import { BudgetsFilter } from '../../budgets/budgets-filter';
import { PeriodsFilter } from '../../periods/periods-filter';
import { HttpParams } from '@angular/common/http';

export class TimeframeFilter {

  public periods: ReplaySubject<Array<Period>> = new ReplaySubject<Array<Period>>(1);
  public defaultPeriod: BehaviorSubject<Period> = new BehaviorSubject<Period>(null);
  public budgetsObservable: Subscription;
  public periodsObservable: Subscription;
  public periodsFilter: PeriodsFilter;
  public budgetsFilter: BudgetsFilter;
  public filters: Array<any>;
  public initialized: boolean = false;
  public debug: boolean = false;
  public bypass_budget_change: boolean = false;

  constructor(
    public timeframeService: TimeframeService,
    public periodsService: PeriodsService,
  ) {
    this.periodsFilter = new PeriodsFilter(
      timeframeService,
      this.periods,
      this.defaultPeriod,
    );

    this.budgetsFilter = new BudgetsFilter(timeframeService);

    // Initialise default period
    this.timeframeService.currentPeriod.subscribe(
      defaultPeriod => {
        this.defaultPeriod.next(defaultPeriod);
      }
    );

    // Subscribe to budget changes, fetch periods for each change and feed the filter options with it
    this.budgetsObservable = this.budgetsFilter.observable.subscribe(
      budget => {
        this.debug && console.log("timeframe filter: received new budget", budget);
        if (budget != null) {
          const options = new HttpParams({
            fromString: budget,
          });

          periodsService.getAll(options).pipe(finalize(() => { this.initialized = true; this.bypass_budget_change = false; })).subscribe(
            periods => {
              this.debug && console.log("timeframe filter: received periods", periods);
              this.periods.next(periods);
              this.periodsFilter.observable.pipe(take(1)).subscribe(period => {
                this.debug && console.log("timeframe filter: received value from period filter", period);
                if (this.initialized) {
                  this.debug && console.log("timeframe filter: we are initialized");
                  if (period !== 'period_id=') {
                    this.debug && console.log("timeframe filter: received period is not empty, pushing first one from new budget.");
                    if (this.bypass_budget_change) {
                      this.debug && console.log('timeframe filter: selection of first period bypassed.');
                    } else {
                      this.debug && console.log('timeframe filter: pushed first period.');
                      this.periodsFilter.current.next(periods[0]);
                    }
                  } else {
                    this.debug && console.log("timeframe filter: received period is empty, so we want to keep it, not pushing anything.");
                  }
                } else {
                  this.debug && console.log("timeframe filter: not initialized, intializing and not pushing anything.");
                }
              });
            }
          );
        } else {
          // We should probably push [] there, but it breaks stuff in filter component
          this.periods.next([]);
        }
      }
    );

    //this.periodsObservable = this.periodsFilter.observable.subscribe(
    this.periodsObservable = this.timeframeService.currentPeriod.subscribe(
      period => {
        this.debug && console.log('timeframe filter: received new period', period);
        if (period !== null && this.initialized) {
          this.debug && console.log('timeframe filter: receiver period not null');
          this.periods.pipe(take(1)).subscribe(
            periods => {
              this.debug && console.log('timeframe filter: received periods');
              this.debug && console.log('timeframe filter: find result', periods.find(p => p.id === period.id));
              if ((periods.find(p => p.id === period.id)) === undefined) {
                this.debug && console.log('timeframe filter: received period is not in current budget!');
                this.bypass_budget_change = true;
                this.debug && console.log('timeframe filter: bypassing budget change');
                this.budgetsFilter.current.next(period.budget);
                this.budgetsFilter.observable.pipe(skip(1), take(1)).subscribe(
                  budget => {
                    this.debug && console.log('timeframe filter: received new selected budget', budget);
                    this.periodsFilter.current.next(period);
                  }
                );
              } else {
                this.debug && console.log('timeframe filter: received period is in periods', periods);
              }
            }
          );
        }
      }
    );

    this.filters = [
      this.periodsFilter,
      this.budgetsFilter,
    ];
  }

  public optionValue(period) {
    return period ? period.id : null;
  }

  public optionString(period) {
    return period.name;
  }

  public defaultObject(period) {
    return period || null;
  }

  public unsubscribe() {
    this.budgetsObservable.unsubscribe();
    this.periodsObservable.unsubscribe();
  }
}
