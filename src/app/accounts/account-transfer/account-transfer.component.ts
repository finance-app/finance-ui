import { finalize, take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

// Services
import { AccountsService } from '../accounts.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { LocationService } from '../../core/services/location.service';
import { StorageService } from '../../core/services/storage.service';

import { combineLatest as observableCombineLatest, ReplaySubject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['./account-transfer.component.css']
})
export class AccountTransferComponent implements OnInit {

  private source_id: ReplaySubject<number> = new ReplaySubject<number>(1);
  private destination_id: ReplaySubject<number> = new ReplaySubject<number>(1);

  // Stores all informations about the form
  public form: any = {
    name: 'account',
    create: this.transfer.bind(this),
    update: this.transfer.bind(this),
    data: new ReplaySubject<any>(),
    nextButton: false,
    createStaticText: 'Transfer',
    createProgressText: 'Transferring...',
    fields: [
      {
        id: 'value',
        label: 'Balance',
        placeholder: 'E.g. 4.52',
        type: 'number',
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
        options: this.accountsService.accounts,
        value: function(account) { return account.id; },
        defaultValue: this.source_id,
        description: function(account) { return account.name + ' (' + account.currency.name + ')'; },
        validators: [
          Validators.required,
        ]
      },
      {
        id: 'destination_id',
        label: 'Destination',
        placeholder: 'E.g. My wallet',
        type: 'select',
        options: this.accountsService.accounts,
        value: function(account) { return account.id; },
        defaultValue: this.destination_id,
        description: function(account) { return account.name + ' (' + account.currency.name + ')'; },
        validators: [
          Validators.required,
        ]
      },
      {
        id: 'date',
        type: 'date',
        label: 'Date',
        max: new BehaviorSubject<any>(moment().format('YYYY-MM-DD')),
        defaultValue: new BehaviorSubject<any>(moment().format('YYYY-MM-DD')),
        validators: [
          Validators.required,
        ]
      },
    ],
  };

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute,
    public  locationService: LocationService,
    private storageService: StorageService,
  ) {
    accountsService.getAll();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['source_id'] && params['destination_id']) {
        observableCombineLatest(
          this.accountsService.edit(params['source_id']),
          this.accountsService.edit(params['destination_id']),
        ).pipe(take(1)).subscribe(
          ([source, destination]) => {
            this.source_id.next(source);
            this.destination_id.next(destination);
            this.form.title = 'Create transfer from account ' + source.name + ' to ' + destination.name;
          }
        );
      } else if (params['source_id']) {
        this.source_id.next(params['source_id']);
        this.accountsService.edit(params['source_id']).subscribe(
          source => {
            this.source_id.next(source);
            this.form.title = 'Create transfer from account ' + source.name;
          }
        );
      } else {
        this.accountsService.edit(params['destination_id']).subscribe(
          destination => {
            this.destination_id.next(destination);
            this.form.title = 'Create transfer to account ' + destination.name;
          }
        );
      }
    });
  }

  transfer(formGroup) {
    const subject = new ReplaySubject<any>();
    this.accountsService.transfer(formGroup.value.source_id, formGroup.value.destination_id, formGroup.value.date, formGroup.value.value).pipe(
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
}
