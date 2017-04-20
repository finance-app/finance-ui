import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponsiveModule } from 'ngx-responsive'
//import { FlashMessagesModule } from 'angular2-flash-messages';
// Workaround importing this module
import { FlashMessagesModule } from 'angular2-flash-messages/module/module.js';
import { AutofocusModule } from 'angular-autofocus-fix';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ChartModule } from 'angular-highcharts';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CapitalizePipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule,
    FlashMessagesModule,
    AutofocusModule,
    CapitalizePipe,
    FontAwesomeModule,
    ChartModule,
    RouterModule,
    ResponsiveModule,
  ],
})
export class SharedModule {}
