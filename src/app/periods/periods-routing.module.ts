import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeriodsComponent } from './periods.component';
import { PeriodComponent } from './period/period.component';
import { PeriodFormComponent }  from './period-form/period-form.component';

const periodsRoutes: Routes = [
  {
    path: '',
    component: PeriodsComponent,
    data: {
      title: 'Periods',
    },
  },
  {
    path: 'new',
    component: PeriodFormComponent,
    data: {
      title: 'New period',
    },
  },
  {
    path: ':id',
    component: PeriodComponent,
    data: {
      title: 'Show period',
    },
  },
  {
    path: ':id/edit',
    component: PeriodFormComponent,
    data: {
      title: 'Edit period',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(periodsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PeriodsRoutingModule { }
