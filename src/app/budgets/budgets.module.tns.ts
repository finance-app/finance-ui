import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

// Services
import { BudgetsService } from './budgets.service';

// Routing
import { BudgetsRoutingModule } from './budgets-routing.module';

// Components
import { BudgetComponent } from './budget/budget.component';
import { BudgetsComponent } from './budgets.component';
import { BudgetsTableComponent } from './budgets-table/budgets-table.component';
import { BudgetFormComponent } from './budget-form/budget-form.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    BudgetsRoutingModule,
  ],
  declarations: [
    BudgetComponent,
    BudgetsComponent,
    BudgetsTableComponent,
    BudgetFormComponent,
  ],
  // Export BudgetsTableComponent, so currencies show can use it
  exports: [
    BudgetsTableComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class BudgetsModule { }
