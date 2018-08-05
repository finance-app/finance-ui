import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FormComponent } from './form/form.component';
import { FilterComponent } from './filter/filter.component';
import { IndexComponent } from './index/index.component';
import { TableComponent } from './table/table.component';
import { SideDrawerDropdownComponent } from './sidedrawer-dropdown/sidedrawer-dropdown.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';

@NgModule({
  imports: [
    SharedModule,
    NativeScriptUIListViewModule,
    NativeScriptUISideDrawerModule,
  ],
  exports: [
    FormComponent,
    FilterComponent,
    IndexComponent,
    TableComponent,
    TableHeaderComponent,
    SideDrawerDropdownComponent,
  ],
  declarations: [
    FormComponent,
    FilterComponent,
    IndexComponent,
    TableComponent,
    TableHeaderComponent,
    SideDrawerDropdownComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class ComponentsModule { }
