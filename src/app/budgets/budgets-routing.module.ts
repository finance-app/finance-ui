import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BudgetsComponent } from './budgets.component';
import { BudgetComponent } from './budget/budget.component';
import { BudgetFormComponent }  from './budget-form/budget-form.component';

const budgetsRoutes: Routes = [
  {
    path: '',
    component: BudgetsComponent,
    data: {
      title: 'Budgets',
    },
  },
  {
    path: 'new',
    component: BudgetFormComponent,
    data: {
      title: 'New budget',
    },
  },
  {
    path: ':id',
    component: BudgetComponent,
    data: {
      title: 'Show budget',
    },
  },
  {
    path: ':id/edit',
    component: BudgetFormComponent,
    data: {
      title: 'Edit budget',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(budgetsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BudgetsRoutingModule { }
