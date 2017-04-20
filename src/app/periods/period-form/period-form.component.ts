
import {finalize} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject ,  ReplaySubject } from 'rxjs';
import * as moment from 'moment';

// Services
import { PeriodsService } from '../periods.service';
import { BudgetsService } from '../../budgets/budgets.service';
import { LocationService } from '../../core/services/location.service';
import { TimeframeService } from '../../core/services/timeframe.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  moduleId: module.id,
  selector: 'app-period-form',
  templateUrl: './period-form.component.html',
  styleUrls: ['./period-form.component.css']
})
export class PeriodFormComponent implements OnInit {

  // Stores all informations about the form
  public form: any = {
    name: 'period',
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
        type: 'hidden',
      },
      {
        id: 'comment',
        label: 'Comment',
        placeholder: 'E.g. Home period',
        type: 'text',
      },
      {
        id: 'budget_id',
        type: 'select',
        label: 'Budget',
        placeholder: 'Select budget...',
        options: this.timeframeService.budgets,
        value: function(budget) { return budget ? budget.id : null; },
        defaultValue: this.timeframeService.currentBudget,
        description: function(budget) { return budget.name + ' (' + budget.currency.name + ')'; },
        addButton: this.newBudget.bind(this),
        validators: [
          Validators.required,
        ],
      },
      {
        id: 'start_date',
        type: 'date',
        label: 'Start date',
        defaultValue: new BehaviorSubject<any>(moment().format('YYYY-MM-DD')),
        validators: [
          Validators.required,
        ]
      },
      {
        id: 'end_date',
        type: 'date',
        label: 'End date',
      },
    ],
  };

  constructor(
    private periodsService: PeriodsService,
    private router: Router,
    private route: ActivatedRoute,
    public  locationService: LocationService,
    public  timeframeService: TimeframeService,
    public budgetsService: BudgetsService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // If there is ID param, fetch data from server and load into form
      if ('id' in params) {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('period_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('period_form');
        } else {
          this.periodsService.edit(params['id'])
            .subscribe(
              period => {
                this.form.data.next(period);
                this.form.instanceName = period.name;
              },
          );
        }
      } else {
        // Try to load form data from local storage
        const formData = this.storageService.getItem('period_form');
        if (formData) {
          this.form.data.next(formData);
          this.form.instanceName = formData.name;
          this.storageService.removeItem('period_form');
        }
      }
    });
  }

  update(formGroup) {
    const subject = new ReplaySubject<any>();
    this.timeframeService.updatePeriod(formGroup.value).pipe(
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
    this.timeframeService.createPeriod(formGroup.value).pipe(
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

  newBudget(formGroup) {
    this.storageService.setItem('period_form', formGroup.value);
    this.router.navigate(['/budgets', 'new']);
  }
}
