import { share, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReplaySubject } from 'rxjs';
import { FinanceApiService } from '../services/finance-api.service';
import { SessionService } from '../services/session.service';
import { AlertsService } from '../alerts/alerts.service';
import { StorageService } from '../services/storage.service';

// Environmental settings
import { environment } from '../../../environments';

@Injectable()
export abstract class AuthCommon implements CanActivate {

  public loggedInObservable: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public loggedInStatic: boolean;

  constructor(
    private api: FinanceApiService,
    private alertsService: AlertsService,
    private sessionService: SessionService,
    private storageService: StorageService,
    private jwtHelperService: JwtHelperService,
  ) {
    this.loggedInObservable.subscribe(loggedIn => {
      this.loggedInStatic = loggedIn;
    });

    setInterval(function() {
      if (this.loggedIn()) {
        if (!this.loggedInStatic || this.loggedInStatic === undefined) {
          this.loggedInObservable.next(true);
        }
      } else {
        if (this.loggedInStatic || this.loggedInStatic === undefined) {
          this.loggedInObservable.next(false);
        }
      }
    }.bind(this), 1000);
  }

  abstract navigate(path);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.loggedIn(true);
  }

  loggedIn(force: boolean = false) {
    if (this.jwtHelperService.isTokenExpired() === false) {
      return true;
    } else {
      this.sessionService.expireSession(force);
      this.storageService.removeGlobalItem('current_user');
      return false;
    }
  }

  currentUser() {
    return this.storageService.getGlobalItem('current_user');
  }

  login(credentials) {
    const response = this.api.post('/user_token', {'auth': credentials}).pipe(
      map(res => res.body),
      share(), );

    response.subscribe(
      data => {
        this.storageService.setGlobalItem(environment.tokenCookie, data['jwt']);
        this.storageService.setGlobalItem('current_user', credentials.email);
        this.sessionService.activateSession();
        this.alertsService.addAlert('login', 'success', 'Succesfully logged in!');
      },
      error => {
        this.alertsService.addAlert('login', 'danger', 'Failed to log in!');
      }
    );
    return response;
  }

  logout() {
    this.storageService.removeGlobalItem(environment.tokenCookie);
    this.storageService.removeGlobalItem('current_user');
    this.navigate(['/login']);
    this.alertsService.addAlert('login', 'success', 'Successfully logged out');
    this.sessionService.deactivateSession();
  }
}
