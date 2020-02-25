
import {finalize} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

// Services
import { TransactionCategoriesService } from '../transaction-categories.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { LocationService } from '../../core/services/location.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-transaction-category-form',
  templateUrl: './transaction-category-form.component.html',
  styleUrls: ['./transaction-category-form.component.css']
})
export class TransactionCategoryFormComponent implements OnInit {

  // Stores all informations about the form
  public form: any = {
    name: 'Transaction Category',
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
        placeholder: 'E.g. Public transport, Salary',
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
        placeholder: 'E.g. Includes cleaning products',
        type: 'text',
      },
    ],
  };

  constructor(
    private transactionCategoriesService: TransactionCategoriesService,
    private router: Router,
    private route: ActivatedRoute,
    public  locationService: LocationService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // If there is ID param, fetch data from server and load into form
      if ('id' in params) {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('transaction_category_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('transaction_category_form');
        } else {
          this.transactionCategoriesService.get(params['id'])
            .subscribe(
              transactionCategory => {
                this.form.data.next(transactionCategory);
                this.form.instanceName = transactionCategory.name;
              },
          );
        }
      } else {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('transaction_category_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('transaction_category_form');
        }
      }
    });
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.transactionCategoriesService.update(formGroup.value).pipe(
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
    this.transactionCategoriesService.create(formGroup.value).pipe(
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
    this.storageService.setItem('transaction_category_form', formGroup.value);
    this.router.navigate(['/transaction_categories', 'new']);
  }
}
