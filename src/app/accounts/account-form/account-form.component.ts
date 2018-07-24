
import {finalize} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject ,  ReplaySubject } from 'rxjs';

// Services
import { AccountsService } from '../accounts.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { LocationService } from '../../core/services/location.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  moduleId: module.id,
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {

  // Stores all informations about the form
  public form: any = {
    name: 'account',
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
        placeholder: 'E.g. Mateusz N26',
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
        placeholder: 'E.g. Main account',
        type: 'text',
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
      },
      {
        id: 'type',
        type: 'select',
        label: 'Type',
        placeholder: 'Select type...',
        options: new BehaviorSubject<any>([{id: 'current'}, {id: 'savings'}]),
        description: function(value) { return value.id.charAt(0).toUpperCase() + value.id.slice(1); },
        value: function(type) { return type.id; },
        validators: [
          Validators.required,
        ],
      },
      {
        id: 'provider',
        type: 'select',
        label: 'Provider',
        placeholder: 'Select provider...',
        options: new BehaviorSubject<any>([{id: 'plain'}]),
        defaultValue: new BehaviorSubject<any>({id: 'plain'}),
        value: function(provider) { return provider.id; },
        description: function(value) { return value.id.charAt(0).toUpperCase() + value.id.slice(1); },
        validators: [
          Validators.required,
        ],
      },
    ],
  };

  constructor(
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
        const formData = this.storageService.getItem('account_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('account_form');
        } else {
          this.accountsService.edit(params['id'])
            .subscribe(
              account => {
                this.form.data.next(account);
                this.form.instanceName = account.name;
              },
          );
        }
      } else {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('account_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('account_form');
        }
      }
    });

    // Fetch all currencies
    this.currenciesService.getAll();
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.accountsService.update(formGroup.value).pipe(
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
    this.accountsService.create(formGroup.value).pipe(
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
    this.storageService.setItem('account_form', formGroup.value);
    this.router.navigate(['/currencies', 'new']);
  }
}
