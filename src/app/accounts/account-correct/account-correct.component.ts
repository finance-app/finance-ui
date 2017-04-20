
import {finalize} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject ,  ReplaySubject } from 'rxjs';
import * as moment from 'moment';

// Services
import { AccountsService } from '../accounts.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { LocationService } from '../../core/services/location.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  moduleId: module.id,
  selector: 'app-account-correct',
  templateUrl: './account-correct.component.html',
  styleUrls: ['./account-correct.component.css']
})
export class AccountCorrectComponent implements OnInit {

  private account_id: number;

  // Stores all informations about the form
  public form: any = {
    name: 'account',
    create: this.correct.bind(this),
    update: this.correct.bind(this),
    data: new ReplaySubject<any>(),
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
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.account_id = params['id'];
      this.accountsService.edit(params['id']).subscribe(account => {
        this.form.title = 'Updata balance for account ' + account.name;
      });
    });
  }

  correct(formGroup) {
    const subject = new ReplaySubject<any>();
    this.accountsService.correct(this.account_id, formGroup.value.date, formGroup.value.value).pipe(
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
