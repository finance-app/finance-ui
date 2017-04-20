import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionsComponent } from './transactions.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionFormComponent }  from './transaction-form/transaction-form.component';

const transactionsRoutes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    data: {
      title: 'Transactions',
    },
  },
  {
    path: 'new',
    component: TransactionFormComponent,
    data: {
      title: 'New transaction',
    },
  },
  {
    path: ':id',
    component: TransactionComponent,
    data: {
      title: 'Show transaction',
    },
  },
  {
    path: ':id/edit',
    component: TransactionFormComponent,
    data: {
      title: 'Edit transaction',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(transactionsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TransactionsRoutingModule { }
