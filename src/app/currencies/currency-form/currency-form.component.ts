
import {finalize} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

// Services
import { CurrenciesService } from '../currencies.service';
import { LocationService } from '../../core/services/location.service';

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.css']
})
export class CurrencyFormComponent implements OnInit {

  public form: any = {
    name: 'currency',
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
        placeholder: 'E.g. EUR',
        type: 'text',
        autofocus: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
        ],
      },
      {
        id: 'symbol',
        label: 'Symbol',
        placeholder: 'E.g. €',
        type: 'text',
        validators: [
          Validators.required,
        ],
      },
    ],
  }

  constructor(
    private currenciesService: CurrenciesService,
    private router: Router,
    private route: ActivatedRoute,
    public  locationService: LocationService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // If there is ID param, fetch data from server and load into form
      if ('id' in params) {
        this.currenciesService.edit(params['id'])
          .subscribe(
            data => {
              this.form.data.next(data);
              this.form.instanceName = data.name;
            },
        );
      } else {
        // We are not updating, so no data for form to load
        this.form.data.complete();
      }
    });
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.currenciesService.update(formGroup.value).pipe(
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
    this.currenciesService.create(formGroup.value).pipe(
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
}
