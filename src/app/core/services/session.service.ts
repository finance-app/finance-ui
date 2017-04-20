import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AlertsService } from '../alerts/alerts.service';
import { StorageService } from './storage.service';

import { SessionCommon } from './session.common';

@Injectable()
export class SessionService extends SessionCommon {

  constructor(
    private _location: Location,
    private _router: Router,
    private _alertsService: AlertsService,
    private _storageService: StorageService,
  ) {
    super(_location, _router, _alertsService, _storageService);
  }

  navigate(path, params) {
    this._router.navigate(path, params);
  }
}
