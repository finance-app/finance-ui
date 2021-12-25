import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
    CapitalizePipe,
    FontAwesomeModule,
    ChartModule,
    RouterModule,
    AutoFocusDirective,
  ],
})
export class SharedModule {}
