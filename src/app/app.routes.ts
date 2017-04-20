import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './static/login/login.component';
import { OverviewComponent } from './static/overview/overview.component';
import { TodoComponent } from './static/todo/todo.component';

import { AuthService } from './core/services/auth.service';
/**
 * Define app module routes here, e.g., to lazily load a module
 * (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
 */
export const AppRoutes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    canActivate: [AuthService],
    data: {
      title: 'Overview',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthService],
    data: {
      title: 'Overview',
    },
  },
  {
    path: 'todo',
    component: TodoComponent,
    canActivate: [AuthService],
    data: {
      title: 'TODO',
    },
  },
  {
    path: 'accounts',
    loadChildren: '~/app/accounts/accounts.module#AccountsModule',
    canActivate: [AuthService],
  },
  {
    path: 'periods',
    loadChildren: '~/app/periods/periods.module#PeriodsModule',
    canActivate: [AuthService],
  },
  {
    path: 'budgets',
    loadChildren: '~/app/budgets/budgets.module#BudgetsModule',
    canActivate: [AuthService],
  },
  {
    path: 'currencies',
    loadChildren: '~/app/currencies/currencies.module#CurrenciesModule',
    canActivate: [AuthService],
  },
  {
    path: 'targets',
    loadChildren: '~/app/targets/targets.module#TargetsModule',
    canActivate: [AuthService],
  },
  {
    path: 'transaction_categories',
    loadChildren: '~/app/transaction-categories/transaction-categories.module#TransactionCategoriesModule',
    canActivate: [AuthService],
  },
  {
    path: 'transactions',
    loadChildren: '~/app/transactions/transactions.module#TransactionsModule',
    canActivate: [AuthService],
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [AuthService],
  }
];
