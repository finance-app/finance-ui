
import {finalize, take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

// Services
import { AlertsService } from '../alerts/alerts.service';
import { PeriodsService } from '../../periods/periods.service';
import { BudgetsService } from '../../budgets/budgets.service';
import { SessionService } from './session.service';
import { StorageService } from './storage.service';

import { Budget } from '../../budgets/budget';
import { Period } from '../../periods/period';

import { Subject ,  ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable()
export class TimeframeService {

  public _currentBudget: Budget = null;
  public _currentPeriod: Period = null;
  public currentBudget: BehaviorSubject<Budget> = new BehaviorSubject<Budget>(null);
  public currentPeriod: BehaviorSubject<Period> = new BehaviorSubject<Period>(null);

  public budgets: ReplaySubject<Array<Budget>> = new ReplaySubject<Array<Budget>>(1);

  public _periods: Array<Period>;
  public periods: ReplaySubject<Array<Period>> = new ReplaySubject<Array<Period>>(1);

  constructor(
    private alertsService: AlertsService,
    private periodsService: PeriodsService,
    private budgetsService: BudgetsService,
    private sessionService: SessionService,
    private storageService: StorageService,
  ) {
    // Forward budgets list
    this.budgetsService.budgets.subscribe(budgets => {
      this.budgets.next(budgets);
    });

    // React for changes in budgets
    this.budgets.subscribe(
      budgets => {
        this.currentBudget.pipe(take(1)).subscribe(currentBudget => {
          if (currentBudget) {
            // If current budget does not exist anymore, force switching to all budgets
            // Otherwise update current budget object (maybe it was edited)
            let budget = budgets.find(budget => (budget.id == currentBudget.id));
            if (!budget) {
              this.selectBudget(null);
            } else {
              if (currentBudget.id != budget.id || currentBudget.name != budget.name) {
                this.selectBudget(budget);
              }
            }
          }
        });
      }
    );

    // React for internal changes in periods
    this.periods.subscribe(
      periods => {
        this.currentPeriod.pipe(take(1)).subscribe(currentPeriod => {
          const period = currentPeriod && periods.find(period => (period.id == currentPeriod.id));

          // If current period does not exist anymore, force switching to all periods
          if (currentPeriod && !period) {
            this.selectPeriod(null);
          } else if (period && currentPeriod && period.name != currentPeriod.name) {
            this.selectPeriod(period);
          }
        });
      }
    );

    // React for changes of current budget
    this.currentBudget.subscribe(
      budget => {
        this._currentBudget = budget;
        if (budget) {
          const options = new HttpParams({
            fromString: 'budget_id=' + budget.id,
          });

          this.periodsService.getAll(options).subscribe(
            periods => {
              this._periods = periods;
              this.periods.next(this._periods);
              // Select latest period in budget if current period is not in current budget
              // Assumes that API returns latest period first
              this.currentPeriod.pipe(take(1)).subscribe(currentPeriod => {
                if (!currentPeriod || currentPeriod.budget.id != budget.id) {
                  this.selectPeriod(periods.find(period => (period.budget.id == budget.id)));
                }
              });
            }
          );
        } else {
          this._periods = [];
          this.periods.next(this._periods);
          this.currentPeriod.next(null);
        }
      }
    );

    // React for changes of current period
    this.currentPeriod.subscribe(
      period => {
        this._currentPeriod = period;
        if (period) {
          if (!this.isCurrentBudget(period.budget)) {
            this.selectBudget(period.budget);
          }
        }
      }
    );

    this.sessionService.sessionStatus.subscribe(sessionStatus => {
      if (sessionStatus) {
        this.init();
      } else {
        this._periods = [];
        this.periods.next(this._periods);
      }
    });
  }

  // This function is used, when we have to re-initialise the service, for example when current user changes
  init() {
    this.budgetsService.getAll().subscribe(budgets => {
      // Try to load current period from local storage
      const currentPeriod = this.storageService.getItem('current_period');
      if (currentPeriod) {
        if (currentPeriod.id != (this._currentPeriod || {} as Period).id) {
          this.currentPeriod.next(currentPeriod);
        }
      } else {
        // If there is no current period, emit current budget, even if it's null
        const currentBudget = this.storageService.getItem('current_budget');
        if (((currentBudget || {} as Budget).id != (this._currentBudget || {} as Budget).id) || (currentBudget === null && this._currentBudget === null)) {
          this.currentBudget.next(currentBudget);
        }
      }
    });
  }

  // interacts with budgets service to set current budget
  selectBudget(budget = null) {
    if (budget) {
      this.alertsService.addAlert('budget_select', 'success', 'Selected budget ' + budget.name + '.');
      this.currentBudget.next(budget);
      // Remove field property, otherwise we get Converting circular structure to JSON error.
      let _budget = Object.assign({}, budget)
      delete _budget.field;
      this.storageService.setItem('current_budget', _budget);
    } else {
      this.sessionService.sessionStatus.pipe(take(1)).subscribe(sessionStatus => {
        if (sessionStatus) {
          this.storageService.removeItem('current_budget');
          this.currentBudget.next(null);
          this.selectPeriod(null);
          this.alertsService.addAlert('budget_select', 'success', 'Selected all budgets.');
        }
      });
    }
  }

  // interacts with periods service to set current period
  selectPeriod(period = null) {
    if (period) {
      this.alertsService.addAlert('period_select', 'success', 'Selected period ' + period.name + '.');
      this.currentPeriod.next(period);
      // Remove field property, otherwise we get Converting circular structure to JSON error.
      let _period = Object.assign({}, period);
      delete _period.field;
      this.storageService.setItem('current_period', _period);
    } else {
      this.sessionService.sessionStatus.pipe(take(1)).subscribe(sessionStatus => {
        if (sessionStatus) {
          this.storageService.removeItem('current_period');
          this.currentPeriod.next(null);
          this.alertsService.addAlert('period_select', 'success', 'Selected all periods.');
        }
      });
    }
  }

  // returns URL params which should be applied to get data for specific timeperiod
  getParams() {
    console.log('getParams');
  }

  isCurrentBudget(budget = null) {
    if (budget == null || this._currentBudget == null) {
      return budget == this._currentBudget;
    } else {
      return budget.id == this._currentBudget.id;
    }
  }

  isCurrentPeriod(period = null) {
    if (period == null || this._currentPeriod == null) {
      return period == this._currentPeriod;
    } else {
      return period.id == this._currentPeriod.id;
    }
  }

  deleteBudget(budget: Budget) {
    const subject = new Subject<any>();

    this.budgetsService.delete(budget).subscribe(
      data => {
        subject.next(data);
        if (this.isCurrentBudget(budget)) {
          this.selectBudget(null);
        }
      }
    );

    return subject;
  }

  deletePeriod(period: Period) {
    const subject = new Subject<any>();

    this.periodsService.delete(period).subscribe(
      data => {
        subject.next(data);
        if (this.isCurrentPeriod(period)) {
          this.selectPeriod(null);
        }
        const index = this._periods.indexOf(this._periods.find(p => p.id === period.id));
        this._periods.splice(index, 1);
        this.periods.next(this._periods);
      }
    );

    return subject;
  }

  cyclePeriod(period: Period) {
    const subject = new Subject<any>();

    this.periodsService.cycle(period).subscribe(
      data => {
        subject.next(data);

        // Update cycled period
        const index = this._periods.indexOf(this._periods.find(p => p.id === period.id), 0);
        this._periods[index] = data[1];

        // Push newly created period
        this._periods.unshift(data[0]);

        this.periods.next(this._periods);

        // If cycled period is current one, select new
        if (this.isCurrentPeriod(period)) {
          this.selectPeriod(data[0]);
        }
      }
    );

    return subject;
  }

  closePeriod(period: Period) {
    const subject = new Subject<any>();

    this.periodsService.close(period).subscribe(
      data => {
        subject.next(data);
        const index: number = this._periods.indexOf(this._periods.find(p => p.id === period.id), 0);
        this._periods[index] = data;
        this.periods.next(this._periods);

        if (this.isCurrentPeriod(period)) {
          this.currentPeriod.next(data);
          this.storageService.setItem('current_period', data);
        }
      }
    );

    return subject;
  }

  reopenPeriod(period: Period) {
    const subject = new Subject<any>();

    this.periodsService.reopen(period).subscribe(
      data => {
        subject.next(data);

        const index = this._periods.indexOf(this._periods.find(p => p.id === period.id), 0);
        this._periods[index] = data;
        this.periods.next(this._periods);

        if (this.isCurrentPeriod(period)) {
          this.currentPeriod.next(data);
          this.storageService.setItem('current_period', data);
        }
      }
    );

    return subject;
  }

  createBudget(budget: Budget) {
    const subject = new Subject<any>();

    this.budgetsService.create(budget).pipe(finalize(() => subject.complete())).subscribe(
      data => {
        subject.next(data);
      }
    );

    return subject;
  }

  createPeriod(period: Period) {
    const subject = new Subject<any>();

    this.periodsService.create(period).pipe(finalize(() => subject.complete())).subscribe(
      data => {
        subject.next(data);
        if (this.isCurrentBudget(data.budget)) {
          this._periods.unshift(data);
          this.periods.next(this._periods);
        }
      }
    );

    return subject;
  }

  updatePeriod(period) {
    const subject = new ReplaySubject<any>();
    this.periodsService.update(period).pipe(
      finalize(() => subject.complete()))
      .subscribe(
        data => {
          subject.next(data);

          const index = this._periods.indexOf(this._periods.find(p => p.id === data.id), 0);
          this._periods[index] = data;
          this.periods.next(this._periods);

          if (this.isCurrentPeriod(data)) {
            this.currentPeriod.next(data);
            this.storageService.setItem('current_period', data);
          }
        },
    );
    return subject;
  }
}
