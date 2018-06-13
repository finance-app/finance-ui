import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

// Services
import { LocationService } from '../services/location.service';

// Models
import { Alert } from './alert';

@Injectable()
export class AlertsService {

  public alerts: any = {};
  private pendingAlerts: any = {};
  private reloading = false;
  private locationUsed = false;

  constructor(
    private locationService: LocationService,
  ) {
    locationService.events.subscribe(
      event => {
        if (event == 'start') {
          this.removeAlerts();
          this.reloading = true;
        } else if (event == 'finish') {
          this.reloading = false;
          this.alerts = this.pendingAlerts;
          window.scrollTo(0, 0);
          this.pendingAlerts = {};
        }
      }
    );
  }

  public addAlert(id: string, type: string, message: string, reload: boolean = false) {
    const alert = {
      type: type,
      message: message,
    };
    if (this.reloading || reload) {
      this.pendingAlerts[id] = alert;
    } else {
      this.alerts[id] = alert;
      window.scrollTo(0, 0);
    }
  }

  public removeAlert(id: string) {
    delete this.alerts[id];
  }

  public removeAlerts() {
    this.alerts = {};
  }
}
