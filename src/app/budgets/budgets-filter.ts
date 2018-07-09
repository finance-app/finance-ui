import { ReplaySubject } from 'rxjs';
import { Budget } from './budget';
import { TimeframeService } from '../core/services/timeframe.service';

export class BudgetsFilter {

  public title: string = 'Budget';
  public property: string = 'budget_id';
  public options: ReplaySubject<Array<Budget>> = new ReplaySubject<Array<Budget>>(1);
  public observable: ReplaySubject<any> = new ReplaySubject<any>(1);
  public defaultObservable: ReplaySubject<Budget> = new ReplaySubject<Budget>(1);;
  public subscriptions: any = [];
  public current: any;

  constructor(
    public timeframeService: TimeframeService,
  ) {
    this.subscriptions.push(timeframeService.budgets.subscribe(budgets => {
      this.options.next(budgets);
    }));
    this.subscriptions.push(timeframeService.currentBudget.subscribe(budget => {
      this.defaultObservable.next(budget);
    }));
  }

  public optionValue(budget) {
    return budget ? budget.id : null;
  }

  public optionString(budget) {
    return budget.name + ' (' + budget.currency.name + ')';
  }

  public defaultObject(budget) {
    return budget || null;
  }
}
