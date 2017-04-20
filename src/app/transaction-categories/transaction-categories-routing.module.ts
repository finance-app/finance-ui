import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionCategoriesComponent } from './transaction-categories.component';
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';
import { TransactionCategoryFormComponent }  from './transaction-category-form/transaction-category-form.component';

const transactionCategoriesRoutes: Routes = [
  {
    path: '',
    component: TransactionCategoriesComponent,
    data: {
      title: 'Transaction Categories',
    },
  },
  {
    path: 'new',
    component: TransactionCategoryFormComponent,
    data: {
      title: 'New Transaction Category',
    },
  },
  {
    path: ':id',
    component: TransactionCategoryComponent,
    data: {
      title: 'Show Transaction Category',
    },
  },
  {
    path: ':id/edit',
    component: TransactionCategoryFormComponent,
    data: {
      title: 'Edit Transaction Category',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(transactionCategoriesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TransactionCategoriesRoutingModule { }
