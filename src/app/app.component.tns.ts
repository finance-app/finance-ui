import { Component, OnInit } from '@angular/core';
import * as app from 'application';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';

// vendor dependencies
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './core/services/auth.service';
import { SessionService } from './core/services/session.service';
import { TimeframeService } from './core/services/timeframe.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _selectedPage: string;
  private _sideDrawerTransition: DrawerTransitionBase;

  public budgetsOpened = false;
  public periodsOpened = false;
  public timeframesOpened = false;

  constructor(
    private translateService: TranslateService,
    public authService: AuthService,
    public timeframeService: TimeframeService,
    private sessionService: SessionService,
    private routerExtensions: RouterExtensions,
    private currentRoute: ActivatedRoute,
  ) {
    translateService.setTranslation('en', require('../assets/i18n/en.json'));
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

  ngOnInit(): void {
    this._selectedPage = 'Overview';
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  public logout() {
    this.authService.logout();
    this.closeDrawer();
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  isPageSelected(pageTitle: string): boolean {
    return pageTitle === this._selectedPage;
  }

  public toggleBudgets() {
    this.budgetsOpened = !this.budgetsOpened;
  }

  public togglePeriods() {
    this.periodsOpened = !this.periodsOpened;
  }

  public toggleTimeframes() {
    this.timeframesOpened = !this.timeframesOpened;
  }

  closeDrawer(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public closeAll(): void {
    this.budgetsOpened = false;
    this.periodsOpened = false;
    this.timeframesOpened = false;
  }

  onNavItemTap(navItemRoute: string, title: string): void {
    this._selectedPage = title;
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade'
      },
      relativeTo: this.currentRoute,
    });

    this.closeDrawer();
  }
}
