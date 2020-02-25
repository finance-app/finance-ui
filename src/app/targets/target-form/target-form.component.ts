import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

// Services
import { TargetsService } from '../targets.service';
import { TransactionCategoriesService } from '../../transaction-categories/transaction-categories.service';
import { BudgetsService } from '../../budgets';
import { LocationService } from '../../core/services/location.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-target-form',
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.css']
})
export class TargetFormComponent implements OnInit {

  // Stores all informations about the form
  public form: any = {
    name: 'Target',
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
        placeholder: 'E.g. Rewe',
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
        placeholder: 'E.g. Shop near my house',
        type: 'text',
      },
      {
        id: 'favourite',
        label: 'Favourite',
        type: 'checkbox',
      },
      {
        id: 'default_income_transaction_category_id',
        type: 'select',
        label: 'Income category',
        placeholder: 'Select income category...',
        options: this.transactionCategoriesService.transactionCategories,
        allowEmpty: true,
        value: function(transaction_category) { return transaction_category.id; },
        description: function(transaction_category) { return transaction_category.name },
        addButton: this.newTransactionCategory.bind(this),
      },
      {
        id: 'default_expense_transaction_category_id',
        type: 'select',
        label: 'Expense category',
        placeholder: 'Select expense category...',
        options: this.transactionCategoriesService.transactionCategories,
        allowEmpty: true,
        value: function(transaction_category) { return transaction_category.id; },
        description: function(transaction_category) { return transaction_category.name },
        addButton: this.newTransactionCategory.bind(this),
      },
      {
        id: 'budgets',
        type: 'multiselect',
        label: 'Budgets',
        placeholder: 'Limit target to specific budgets',
        options: this.budgetsService.budgets,
        value: function(budget) { return budget.id; },
        description: function(budget) { return budget.name + ' (' + budget.currency.name + ')' },
      }
    ],
  };

  constructor(
    private transactionCategoriesService: TransactionCategoriesService,
    private targetsService: TargetsService,
    private router: Router,
    private route: ActivatedRoute,
    public  locationService: LocationService,
    private storageService: StorageService,
    private budgetsService: BudgetsService,
  ) { }

  ngOnInit() {
    this.transactionCategoriesService.getAll();
    this.route.params.subscribe(params => {
      // If there is ID param, fetch data from server and load into form
      if ('id' in params) {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('target_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('target_form');
        } else {
          this.targetsService.edit(params['id'])
            .subscribe(
              target => {
                this.form.data.next(target);
                this.form.instanceName = target.name;
              },
          );
        }
      } else {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('target_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('target_form');
        }
      }
    });
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.targetsService.update(formGroup.value).pipe(
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
    this.targetsService.create(formGroup.value).pipe(
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

  newTransactionCategory(formGroup) {
    this.storageService.setItem('target_form', formGroup.value);
    this.router.navigate(['/transaction_categories', 'new']);
  }
}
