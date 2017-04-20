import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

// Services
import { CurrenciesService } from './currencies.service';

// Routing
import { CurrenciesRoutingModule } from './currencies-routing.module';

// Components
import { CurrencyComponent } from './currency/currency.component';
import { CurrenciesComponent } from './currencies.component';
import { CurrencyFormComponent } from './currency-form/currency-form.component';

// Modules
import { BudgetsModule } from '../budgets/budgets.module';
import { AccountsModule } from '../accounts/accounts.module';
import { CurrenciesTableComponent } from './currencies-table/currencies-table.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    CurrenciesRoutingModule,
    BudgetsModule,
    AccountsModule,
  ],
  declarations: [
    CurrenciesComponent,
    CurrencyFormComponent,
    CurrencyComponent,
    CurrenciesTableComponent,
  ],
  providers: [
  ],
})
export class CurrenciesModule { }
