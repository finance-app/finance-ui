import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

// Services
import { TransactionCategoriesService } from './transaction-categories.service';

// Routing
import { TransactionCategoriesRoutingModule } from './transaction-categories-routing.module';

// Components
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';
import { TransactionCategoriesComponent } from './transaction-categories.component';
import { TransactionCategoriesTableComponent } from './transaction-categories-table/transaction-categories-table.component';
import { TransactionCategoryFormComponent } from './transaction-category-form/transaction-category-form.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    TransactionCategoriesRoutingModule,
  ],
  declarations: [
    TransactionCategoryComponent,
    TransactionCategoriesComponent,
    TransactionCategoriesTableComponent,
    TransactionCategoryFormComponent,
  ],
  // Export TransactionCategoriesTableComponent, so currencies show can use it
  exports: [
    TransactionCategoriesTableComponent,
  ],
})
export class TransactionCategoriesModule { }
