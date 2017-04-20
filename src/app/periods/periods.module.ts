import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

// Services
import { PeriodsService } from './periods.service';

// Routing
import { PeriodsRoutingModule } from './periods-routing.module';

// Components
import { PeriodComponent } from './period/period.component';
import { PeriodsComponent } from './periods.component';
import { PeriodsTableComponent } from './periods-table/periods-table.component';
import { PeriodFormComponent } from './period-form/period-form.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    PeriodsRoutingModule,
  ],
  declarations: [
    PeriodComponent,
    PeriodsComponent,
    PeriodsTableComponent,
    PeriodFormComponent,
  ],
  // Export PeriodsTableComponent, so currencies show can use it
  exports: [
    PeriodsTableComponent,
  ],
})
export class PeriodsModule { }
