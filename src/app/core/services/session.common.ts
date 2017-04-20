import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

// Services
import { AlertsService } from '../alerts/alerts.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments';

@Injectable()
export abstract class SessionCommon {

  // Store session status
  public sessionStatus: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    private location: Location,
    private router: Router,
    private alertsService: AlertsService,
    private storageService: StorageService,
  ) {
    // Session is active by default
    if (this.storageService.getGlobalItem(environment.tokenCookie)) {
      this.activateSession();
    } else {
      this.deactivateSession();
    }
  }

  abstract navigate(path, params): void;

  // This function forces user logout. Graceful logout is handled by AuthService
  expireSession(force: boolean = false) {
    // Make sure that expiration action is done only once.
    this.sessionStatus.pipe(take(1)).subscribe(sessionStatus => {
      if (sessionStatus || force) {
        this.deactivateSession();

        // Strip queryParams, as we only want to get current route.
        const route = this.location.path().split('?')[0];

        // If route is different than /login, include it in returnUrl
        if (route != '/login') {
          // Redirect to login page and include current route in returnUrl
          const queryParams = ['/', ''].includes(route) ? {} : { returnUrl: this.location.path() }
          this.navigate(['/login'], { queryParams: queryParams, queryParamsHandling: 'merge'});

          // Notify user about logging out.
          this.alertsService.addAlert('session', 'danger', 'You are not logged in or the session has expired. Please log in.');
        }
      }
    });
  }

  activateSession() {
    // We should probably initialise all services there.
    this.sessionStatus.next(true);
  }

  deactivateSession() {
    // Ideally all services should subscribe to this one and destroy itself on it's own after user is logged out
    this.sessionStatus.next(false);
  }
}
