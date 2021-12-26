import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './static/login/login.component';
import { OverviewComponent } from './static/overview/overview.component';

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
    path: 'accounts',
    loadChildren: () => import('~/app/accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthService],
  },
  {
    path: 'periods',
    loadChildren: () => import('~/app/periods/periods.module').then(m => m.PeriodsModule),
    canActivate: [AuthService],
  },
  {
    path: 'budgets',
    loadChildren: () => import('~/app/budgets/budgets.module').then(m => m.BudgetsModule),
    canActivate: [AuthService],
  },
  {
    path: 'currencies',
    loadChildren: () => import('~/app/currencies/currencies.module').then(m => m.CurrenciesModule),
    canActivate: [AuthService],
  },
  {
    path: 'targets',
    loadChildren: () => import('~/app/targets/targets.module').then(m => m.TargetsModule),
    canActivate: [AuthService],
  },
  {
    path: 'transaction_categories',
    loadChildren: () => import('~/app/transaction-categories/transaction-categories.module').then(m => m.TransactionCategoriesModule),
    canActivate: [AuthService],
  },
  {
    path: 'transactions',
    loadChildren: () => import('~/app/transactions/transactions.module').then(m => m.TransactionsModule),
    canActivate: [AuthService],
  },
  { path: '**',
    redirectTo: '' }
];
