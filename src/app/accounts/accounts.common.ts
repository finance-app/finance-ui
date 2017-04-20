import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { ComponentsModule } from '../components';

import { AccountsService,
         AccountsRoutingModule,
         AccountComponent,
         AccountsComponent,
         AccountsTableComponent,
         AccountFormComponent,
         AccountCorrectComponent,
         AccountTransferComponent } from '../accounts';

export const IMPORTS: Array<any> = [
  SharedModule,
  ComponentsModule,
  AccountsRoutingModule,
];

export const DECLARATIONS: Array<any> = [
    AccountComponent,
    AccountsComponent,
    AccountsTableComponent,
    AccountFormComponent,
    AccountCorrectComponent,
    AccountTransferComponent
];

export const ENTRY_COMPONENTS: Array<any> = [];

export const EXPORTS: Array<any> = [
  AccountsTableComponent,
];

export const PROVIDERS: Array<any> = [];
