import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AlertsService } from '../alerts/alerts.service';
import { StorageService } from './storage.service';

import { SessionCommon } from './session.common';

import { RouterExtensions } from '@nativescript/angular';

@Injectable()
export class SessionService extends SessionCommon {

  constructor(
    private _location: Location,
    private _router: Router,
    private _alertsService: AlertsService,
    private _storageService: StorageService,
    private _routerExtensions: RouterExtensions,
  ) {
    super(_location, _router, _alertsService, _storageService);
  }

  navigate(path, params) {
    this._routerExtensions.navigate(path, params);
  }
}
