import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrenciesComponent } from './currencies.component';
import { CurrencyFormComponent }  from './currency-form/currency-form.component';
import { CurrencyComponent } from './currency/currency.component';

const currenciesRoutes: Routes = [
  {
    path: '',
    component: CurrenciesComponent,
    data: {
      title: 'Currencies',
    },
  },
  {
    path: 'new',
    component: CurrencyFormComponent,
    data: {
      title: 'New currency',
    },
  },
  {
    path: ':id',
    component: CurrencyComponent,
    data: {
      title: 'Show currency',
    },
  },
  {
    path: ':id/edit',
    component: CurrencyFormComponent,
    data: {
      title: 'Edit currency',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(currenciesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CurrenciesRoutingModule { }
