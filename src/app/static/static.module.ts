import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { OverviewComponent } from './overview/overview.component';
import { LoginComponent } from './login/login.component';
import { TodoComponent } from './todo/todo.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    OverviewComponent,
    LoginComponent,
    TodoComponent,
  ]
})
export class StaticModule { }
