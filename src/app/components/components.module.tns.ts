import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FormComponent } from './form/form.component';
import { FilterComponent } from './filter/filter.component';
import { IndexComponent } from './index/index.component';
import { TableComponent } from './table/table.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
  imports: [
    SharedModule,
    NativeScriptUIListViewModule,
  ],
  exports: [
    FormComponent,
    FilterComponent,
    IndexComponent,
    TableComponent,
    TableHeaderComponent,
  ],
  declarations: [
    FormComponent,
    FilterComponent,
    IndexComponent,
    TableComponent,
    TableHeaderComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class ComponentsModule { }
