import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponsiveModule } from 'ngx-responsive';
import { FlashMessagesModule } from 'angular2-flash-messages/module/module.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ChartModule } from 'angular-highcharts';
import { RouterModule } from '@angular/router';

import { AutoFocusDirective } from './auto-focus.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CapitalizePipe,
    AutoFocusDirective,
  ],
  exports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FlashMessagesModule,
    CapitalizePipe,
    FontAwesomeModule,
    ChartModule,
    RouterModule,
    ResponsiveModule,
    AutoFocusDirective,
  ],
})
export class SharedModule {}
