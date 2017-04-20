import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FormComponent } from './form/form.component';
import { FilterComponent } from './filter/filter.component';
import { IndexComponent } from './index/index.component';
import { TableComponent } from './table/table.component';
import { TableHeaderComponent } from './table-header/table-header.component';

@NgModule({
  imports: [
    SharedModule,
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
  ]
})
export class ComponentsModule { }
