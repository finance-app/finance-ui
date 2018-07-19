import { take, finalize, filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject, BehaviorSubject, Subscription } from 'rxjs';

import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';

// Services
import { TransactionsService } from '../transactions.service';
import { TransactionCategoriesService } from '../../transaction-categories/transaction-categories.service';
import { LocationService } from '../../core/services/location.service';
import { TimeframeService } from '../../core/services/timeframe.service';
import { PeriodsService } from '../../periods/periods.service';
import { BudgetsService } from '../../budgets/budgets.service';
import { TargetsService } from '../../targets/targets.service';
import { AccountsService } from '../../accounts/accounts.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  moduleId: module.id,
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit, OnDestroy {

  public sourceOptions = new ReplaySubject<any>(1);
  private sourceSubscription: Subscription;
  private destinationSubscription: Subscription;
  public destinationOptions = new ReplaySubject<any>(1);
  public dateMin = new ReplaySubject<any>(1);
  public dateMax = new ReplaySubject<any>(1);
  public periods = new ReplaySubject<any>(1);
  public budgets = new ReplaySubject<any>(1);
  public defaultPeriod = new ReplaySubject<any>(1);
  public defaultBudget = new ReplaySubject<any>(1);
  public budget = null;
  private transactionType: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private formGroup;
  private subscriptions: Subscription[] = [];
  private creating: boolean = true;
  private targets = new ReplaySubject<any>(1);
  private accounts = new ReplaySubject<any>(1);

  // Stores all informations about the form
  public form: any = {
    name: 'transaction',
    create: this.create.bind(this),
    update: this.update.bind(this),
    data: new ReplaySubject<any>(1),
    formCallback: this.formCallback.bind(this),
    loadDefaults: this.loadDefaults.bind(this),
    fields: [
      {
        id: 'id',
        type: 'hidden',
      },
      {
        id: 'transaction_type',
        label: 'Expense or income',
        type: 'radio',
        options: new BehaviorSubject<any>(['expense', 'income']),
        defaultValue: new BehaviorSubject<any>('expense'),
        description: function(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
      },
      {
        id: 'value',
        label: 'Value',
        placeholder: 'E.g. 4.52',
        type: 'number',
        min: new BehaviorSubject<any>(0),
        autofocus: true,
        validators: [
          Validators.required,
        ],
      },
      {
        id: 'source_id',
        label: 'Source',
        placeholder: 'E.g. N26 Account',
        type: 'select',
        options: this.sourceOptions,
        value: function(source) { return source.id; },
        description: function(source) { return source.model_name == 'Account' ? (source.name + ' (' + source.currency.name + ')') : source.name; },
        addButton: this.addSource.bind(this),
      },
      {
        id: 'destination_id',
        label: 'Destination',
        placeholder: 'E.g Rewe',
        type: 'select',
        options: this.destinationOptions,
        value: function(destination) { return destination.id; },
        description: function(destination) { return destination.model_name == 'Account' ? (destination.name + ' (' + destination.currency.name + ')') : destination.name; },
        addButton: this.addDestination.bind(this),
      },
      {
        id: 'transaction_category_id',
        type: 'select',
        label: 'Category',
        placeholder: 'Select transaction category...',
        options: this.transactionCategoriesService.transactionCategories,
        value: function(transaction_category) { return transaction_category.id; },
        description: function(transaction_category) { return transaction_category.name },
        addButton: this.addTransactionCategory.bind(this),
        validators: [
          Validators.required,
        ],
      },
      {
        id: 'type',
        label: 'Type',
        type: 'radio',
        options: new BehaviorSubject<any>(['fixed', 'flexible', 'discretionary']),
        defaultValue: new BehaviorSubject<any>('flexible'),
        description: function(value) { return value.charAt(0).toUpperCase() + value.slice(1); },
      },
      {
        id: 'comment',
        label: 'Comment',
        placeholder: 'E.g. Book about Angular',
        type: 'text',
      },
      {
        id: 'budget_id',
        type: 'select',
        label: 'Budget',
        placeholder: 'Select budget...',
        options: this.budgets,
        value: function(budget) { return budget ? budget.id : null; },
        description: function(budget) { return budget.name + ' (' + budget.currency.name + ')'; },
        defaultValue: this.defaultBudget,
        addButton: this.addBudget.bind(this),
        validators: [
          Validators.required,
        ],
      },
      {
        id: 'period_id',
        type: 'select',
        label: 'Period',
        placeholder: 'Select period...',
        options: this.periods,
        value: function(period) { return period ? period.id : null; },
        description: function(period) { return period.name; },
        defaultValue: this.defaultPeriod,
        addButton: this.addPeriod.bind(this),
        validators: [
          Validators.required,
        ],
      },
      {
        id: 'date',
        type: 'date',
        label: 'Date',
        min: this.dateMin,
        max: this.dateMax,
        defaultValue: new BehaviorSubject<any>(moment().format('YYYY-MM-DD')),
        validators: [
          Validators.required,
        ]
      }
    ],
  };

  constructor(
    private transactionCategoriesService: TransactionCategoriesService,
    private transactionsService: TransactionsService,
    private budgetsService: BudgetsService,
    private periodsService: PeriodsService,
    private timeframeService: TimeframeService,
    private router: Router,
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private targetsService: TargetsService,
    public  locationService: LocationService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // If there is ID param, fetch data from server and load into form
      if ('id' in params) {
        this.creating = false;
        // Try to load form data from local storage
        const formData = this.storageService.getItem('transaction_form');
        if (formData) {
          this.form.data.next(formData);
          this.storageService.removeItem('transaction_form');
        } else {
          this.transactionsService.edit(params['id'])
            .subscribe(
              transaction => {
                this.form.data.next(transaction);
              },
          );
        }
      } else {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('transaction_form');
        if (formData) {
          this.form.data.next(formData);
          this.storageService.removeItem('transaction_form');
        }
      }
    });

    // Fetch all categories and accounts
    this.transactionCategoriesService.getAll();
    this.accountsService.getAll().subscribe(accounts => this.accounts.next(accounts));

    // If default budget is null, fetch targets as well.
    this.defaultBudget.pipe(filter(value => value === null), take(1)).subscribe(defaultBudget => {
      const options = new HttpParams({
        fromString: 'sort_by=favourite',
      });
      this.targetsService.getAll(options).subscribe(targets => this.targets.next(targets));
    });

    this.subscriptions.push(this.timeframeService.periods.subscribe(periods => {
      this.periods.next(periods);
    }));
    this.subscriptions.push(this.timeframeService.budgets.subscribe(budgets => {
      this.budgets.next(budgets);
    }));
    this.subscriptions.push(this.timeframeService.currentPeriod.subscribe(period => {
      this.defaultPeriod.next(period);
    }));
    this.subscriptions.push(this.timeframeService.currentBudget.subscribe(budget => {
      this.defaultBudget.next(budget);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((elem) => { elem.unsubscribe(); })
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.transactionsService.update(formGroup.value).pipe(
      finalize(() => subject.complete()))
      .subscribe(
        data => {
          this.locationService.back();
        },
        error => {
          subject.error(error);
        },
    );
    return subject;
  }

  create(formGroup, next) {
    const subject = new ReplaySubject<any>();
    this.transactionsService.create(formGroup.value).pipe(
      finalize(() => subject.complete()))
      .subscribe(
        data => {
          subject.next(data);
          // If we create another payment, copy used budget, period and date
          if (!next) {
            this.locationService.back();
          }
        },
        error => {
          subject.error(error);
        },
    );
    return subject;
  }

  formCallback(formGroup) {
    this.formGroup = formGroup;

    // React to changes on transaction_type (income/expense)
    this.subscriptions.push(formGroup.controls['transaction_type'].valueChanges.pipe(filter(value => value !== null)).subscribe(value => {
      this.transactionType.pipe(take(1)).subscribe(transactionType => {
        // If value differs from previous one
        if (value != transactionType) {
          // Swap source and destination options
          if (value == 'expense') {
            this.accounts.pipe(take(1)).subscribe(accounts => this.sourceOptions.next(accounts));
            this.targets.pipe(take(1)).subscribe(targets => this.destinationOptions.next(targets));
          } else {
            this.accounts.pipe(take(1)).subscribe(accounts => this.destinationOptions.next(accounts));
            this.targets.pipe(take(1)).subscribe(targets => this.sourceOptions.next(targets));
          }

          this.transactionType.next(value);

          // If we we are done with initialisation and there is a change, swap placeholders and values
          if (transactionType) {
            // If this value changes, swap placeholders and values for source and destionation
            const source = this.form.fields.find(field => field.id == 'source_id');
            const destination = this.form.fields.find(field => field.id == 'destination_id');

            let tmp = destination.placeholder;
            destination.placeholder = source.placeholder;
            source.placeholder = tmp;

            tmp = formGroup.controls['destination_id'].value;
            formGroup.controls['destination_id'].patchValue(formGroup.controls['source_id'].value);
            formGroup.controls['source_id'].patchValue(tmp);
          }
        }
      });
    }));

    // React to changes on source
    this.subscriptions.push(formGroup.controls['source_id'].valueChanges.subscribe(value => {
      this.transactionType.pipe(take(1)).subscribe(transactionType => {
        if (!formGroup.controls['transaction_category_id'].dirty && transactionType == 'income') {
          this.targets.pipe(take(1)).subscribe(options => {
            const option = options.find(option => (option.id == value));
            const patchValue = option && option.default_income_transaction_category ? option.default_income_transaction_category.id : null;
            formGroup.controls['transaction_category_id'].patchValue(patchValue);
          });
        }
      });
    }));

    // React to changes on destination
    this.subscriptions.push(formGroup.controls['destination_id'].valueChanges.subscribe(value => {
      this.transactionType.pipe(take(1)).subscribe(transactionType => {
        if (!formGroup.controls['transaction_category_id'].dirty && transactionType == 'expense') {
          this.targets.pipe(take(1)).subscribe(options => {
            const option = options.find(option => (option.id == value));
            const patchValue = option && option.default_expense_transaction_category ? option.default_expense_transaction_category.id : null;
            formGroup.controls['transaction_category_id'].patchValue(patchValue);
          });
        }
      });
    }));

    // React to changes on period
    this.subscriptions.push(formGroup.controls['period_id'].valueChanges.pipe(filter(value => value !== null && value !== undefined)).subscribe(value => {
      this.periods.pipe(take(1)).subscribe(periods => {
        const period = periods.find(period => (period.id == value));
        const patchValue = (period && period.end_date) || moment().format('YYYY-MM-DD');
        this.dateMin.next(period.start_date);
        this.dateMax.next(patchValue);
        const isValid = moment(formGroup.controls['date'].value, 'YYYY-MM-DD').isBetween(moment(period.start_date, 'YYYY-MM-DD'), moment(patchValue, 'YYYY-MM-DD'));
        !isValid && formGroup.controls['date'].patchValue(patchValue);
      });
    }));

    // React to changes on budget
    this.subscriptions.push(formGroup.controls['budget_id'].valueChanges.pipe(filter(value => value !== null)).subscribe(value => {
      // Fetch new data if budget differs from old one
      if (this.budget != value) {
        if (value) {
          // If budget is defined, fetch it's periods
          let options = new HttpParams({
            fromString: 'budget_id=' + value
          });
          this.periodsService.getAll(options).subscribe(periods => {
            this.periods.next(periods);
            formGroup.controls['period_id'].patchValue(periods[0] ? periods[0].id : null);
          });

          // And fetch it to set default account
          this.budgetsService.get(value).pipe(take(2)).subscribe(budget => {
            if (budget.default_account) {
              this.transactionType.pipe(take(1)).subscribe(transactionType => {
                this.creating && formGroup.controls[transactionType == 'income' ? 'destination_id' : 'source_id'].patchValue(budget.default_account.id);
              });
            }
          });
        }

        let options = new HttpParams({
          fromString: 'sort_by=favourite' + (value ? ('&show_empty&budget_id=' + value) : ''),
        });
        this.targetsService.getAll(options).subscribe(targets => {
          this.targets.next(targets);
          this.transactionType.pipe(take(1)).subscribe(transactionType => {
            (transactionType == 'income' ? this.sourceOptions : this.destinationOptions).next(targets);
          });
        });
      }

      this.budget = value;
    }));
  }

  addTransactionCategory(formGroup) {
    this.saveForm(formGroup);
    this.router.navigate(['/transaction_categories', 'new']);
  }

  addSource(formGroup) {
    this.saveForm(formGroup);

    this.transactionType.pipe(take(1)).subscribe(transactionType => {
      if (transactionType == 'income') {
        this.router.navigate(['/targets', 'new']);
      } else {
        this.router.navigate(['/accounts', 'new']);
      }
    });
  }

  addDestination(formGroup) {
    this.saveForm(formGroup);
    this.transactionType.pipe(take(1)).subscribe(transactionType => {
      if (transactionType == 'expense') {
        this.router.navigate(['/targets', 'new']);
      } else {
        this.router.navigate(['/accounts', 'new']);
      }
    });
  }

  saveForm(formGroup) {
    this.storageService.setItem('transaction_form', formGroup.value);
  }

  addPeriod(formGroup) {
    this.saveForm(formGroup);
    this.router.navigate(['/periods', 'new']);
  }

  addBudget(formGroup) {
    this.saveForm(formGroup);
    this.router.navigate(['/budgets', 'new']);
  }

  loadDefaults(values) {
    // Date should go first, so period_id trigger will not wipe it
    this.formGroup.controls.date.patchValue(values.date);
    this.formGroup.controls.budget_id.patchValue(values.budget_id);
    this.formGroup.controls.period_id.patchValue(values.period_id);
    this.formGroup.controls.transaction_type.patchValue(values.transaction_type);
    this.formGroup.controls.type.patchValue(values.type);
    this.formGroup.controls.source_id.patchValue(values.source_id);
  }
}
