import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

// Services
import { TransactionsService } from './transactions.service';

// Routing
import { TransactionsRoutingModule } from './transactions-routing.module';

// Components
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionsComponent } from './transactions.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    TransactionsRoutingModule,
  ],
  declarations: [
    TransactionComponent,
    TransactionsComponent,
    TransactionsTableComponent,
    TransactionFormComponent,
  ],
  // Export TransactionsTableComponent, so currencies show can use it
  exports: [
    TransactionsTableComponent,
  ],
})
export class TransactionsModule { }
