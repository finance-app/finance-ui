import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { JwtHelperService } from '@melonwd/angular-jwt';

// Services
import { FinanceApiService } from '../services/finance-api.service';
import { SessionService } from '../services/session.service';
import { AlertsService } from '../alerts/alerts.service';
import { StorageService } from '../services/storage.service';

import { AuthCommon } from './auth.common';

@Injectable()
export class AuthService extends AuthCommon {

  constructor(
    private _api: FinanceApiService,
    private _alertsService: AlertsService,
    private _sessionService: SessionService,
    private _storageService: StorageService,
    private _jwtHelperService: JwtHelperService,
    private routerExtensions: RouterExtensions,
  ) {
    super(_api, _alertsService, _sessionService, _storageService, _jwtHelperService);
  }

  navigate(path) {
    this.routerExtensions.navigate(path, { clearHistory: true });
  }
}
