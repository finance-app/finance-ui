import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountsComponent } from './accounts.component';
import { AccountComponent } from './account/account.component';
import { AccountFormComponent }  from './account-form/account-form.component';
import { AccountCorrectComponent } from './account-correct/account-correct.component';
import { AccountTransferComponent } from './account-transfer/account-transfer.component';

const accountsRoutes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    data: {
      title: 'Accounts',
    },
  },
  {
    path: 'new',
    component: AccountFormComponent,
    data: {
      title: 'New account',
    },
  },
  {
    path: 'transfer',
    component: AccountTransferComponent,
    data: {
      title: 'New transfer',
    },
  },
  {
    path: ':id',
    component: AccountComponent,
    data: {
      title: 'Show account',
    },
  },
  {
    path: ':id/edit',
    component: AccountFormComponent,
    data: {
      title: 'Edit account',
    },
  },
  {
    path: ':id/correct',
    component: AccountCorrectComponent,
    data: {
      title: 'Correct account balance',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(accountsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountsRoutingModule { }
