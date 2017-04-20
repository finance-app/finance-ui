
import {finalize} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';


// Services
import { BudgetsService } from '../budgets.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { AccountsService } from '../../accounts/accounts.service';
import { LocationService } from '../../core/services/location.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  moduleId: module.id,
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {

  // Stores all informations about the form
  public form: any = {
    name: 'budget',
    create: this.create.bind(this),
    update: this.update.bind(this),
    data: new ReplaySubject<any>(),
    fields: [
      {
        id: 'id',
        type: 'hidden',
      },
      {
        id: 'name',
        label: 'Name',
        placeholder: 'E.g. Berlin',
        type: 'text',
        autofocus: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
        ],
      },
      {
        id: 'comment',
        label: 'Comment',
        placeholder: 'E.g. Home budget',
        type: 'text',
      },
      {
        id: 'default_account_id',
        type: 'select',
        label: 'Default account',
        placeholder: 'Select default account...',
        options: this.accountsService.accounts,
        value: function(account) { return account.id; },
        description: function(account) { return account.name },
        addButton: this.newAccount.bind(this),
      },
      {
        id: 'currency_id',
        type: 'select',
        label: 'Currency',
        placeholder: 'Select currency...',
        options: this.currenciesService.currencies,
        value: function(currency) { return currency.id; },
        description: function(currency) { return currency.name + ' (' + currency.symbol + ')'; },
        addButton: this.newCurrency.bind(this),
        validators: [
          Validators.required,
        ],
      }
    ],
  };

  constructor(
    private budgetsService: BudgetsService,
    private accountsService: AccountsService,
    private router: Router,
    public  currenciesService: CurrenciesService,
    private route: ActivatedRoute,
    public  locationService: LocationService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // If there is ID param, fetch data from server and load into form
      if ('id' in params) {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('budget_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('budget_form');
        } else {
          this.budgetsService.edit(params['id'])
            .subscribe(
              budget => {
                this.form.data.next(budget);
                this.form.instanceName = budget.name;
              },
          );
        }
      } else {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('budget_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('budget_form');
        }
      }
    });

    // Fetch all currencies
    this.currenciesService.getAll();

    // Fetch all accounts
    this.accountsService.getAll();
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.budgetsService.update(formGroup.value).pipe(
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
    this.budgetsService.create(formGroup.value).pipe(
      finalize(() => subject.complete()))
      .subscribe(
        data => {
          subject.next(data);
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

  newCurrency(formGroup) {
    this.storageService.setItem('budget_form', formGroup.value);
    this.router.navigate(['/currencies', 'new']);
  }

  newAccount(formGroup) {
    this.storageService.setItem('budget_form', formGroup.value);
    this.router.navigate(['/accounts', 'new']);
  }
}
