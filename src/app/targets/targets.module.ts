import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

// Services
import { TargetsService } from './targets.service';

// Routing
import { TargetsRoutingModule } from './targets-routing.module';

// Components
import { TargetComponent } from './target/target.component';
import { TargetsComponent } from './targets.component';
import { TargetsTableComponent } from './targets-table/targets-table.component';
import { TargetFormComponent } from './target-form/target-form.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    TargetsRoutingModule,
  ],
  declarations: [
    TargetComponent,
    TargetsComponent,
    TargetsTableComponent,
    TargetFormComponent,
  ],
  // Export TargetsTableComponent, so currencies show can use it
  exports: [
    TargetsTableComponent,
  ],
})
export class TargetsModule { }
