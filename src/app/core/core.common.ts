import { CommonModule } from '@angular/common';

// Global components
import { StaticModule } from '../static';
import { ComponentsModule } from '../components';

// App
import { StorageService } from './services/storage.service';
import { AlertsService } from './alerts/alerts.service';
import { LocationService } from './services/location.service';
import { SessionService } from './services/session.service';
import { FinanceApiService } from './services/finance-api.service';
import { AuthService } from './services/auth.service';
import { TimeframeService } from './services/timeframe.service';
import { ModalService } from './services/modal.service';
import { FilterService } from './services/filter.service';

// Singleton feature services
import { BudgetsService } from '../budgets';
import { CurrenciesService } from '../currencies';
import { AccountsService } from '../accounts';
import { TransactionCategoriesService } from '../transaction-categories';
import { TargetsService } from '../targets';
import { PeriodsService } from '../periods';
import { TransactionsService } from '../transactions';

// Global components
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { AlertsComponent } from './alerts/alerts.component';

export const IMPORTS: any[] = [
  CommonModule,
  StaticModule,
  ComponentsModule
];

export const DECLARATIONS: any[] = [
  ConfirmationModalComponent,
  AlertsComponent,
];

export const ENTRY_COMPONENTS: any[] = [
  ConfirmationModalComponent,
  AlertsComponent,
];

export const EXPORTS: any[] = [
  CommonModule,
  ConfirmationModalComponent,
  ComponentsModule,
  AlertsComponent
];

export const PROVIDERS: any[] = [
  AlertsService,
  AuthService,
  CurrenciesService,
  FinanceApiService,
  BudgetsService,
  SessionService,
  LocationService,
  AccountsService,
  TransactionCategoriesService,
  TargetsService,
  PeriodsService,
  TimeframeService,
  TransactionsService,
  StorageService,
  ModalService,
  FilterService,
];
