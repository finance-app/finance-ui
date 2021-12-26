import { Component, OnInit } from '@angular/core';
import * as app from '@nativescript/core/application';
import { RouterExtensions } from '@nativescript/angular';
import { ActivatedRoute } from '@angular/router';
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { Subject } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { SessionService } from './core/services/session.service';
import { TimeframeService } from './core/services/timeframe.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _selectedPage: string;
  private _sideDrawerTransition: DrawerTransitionBase;

  public timeframesOpened = false;
  public drawerOpened: Subject<boolean> = new Subject<boolean>();

  constructor(
    public authService: AuthService,
    public timeframeService: TimeframeService,
    private sessionService: SessionService,
    private routerExtensions: RouterExtensions,
    private currentRoute: ActivatedRoute,
  ) {}

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

  public toggleTimeframes() {
    this.timeframesOpened = !this.timeframesOpened;
  }

  closeDrawer(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public closeAll(): void {
    this.drawerOpened.next(false);
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

  optionValue(i) {
    return i ? i.id : null;
  }

  periodString(period) {
    return period.name;
  }

  periodTap(period) {
    this.timeframeService.isCurrentPeriod(period) || this.timeframeService.selectPeriod(period);
  }

  periodTapAll() {
    this.timeframeService.isCurrentPeriod() || this.timeframeService.selectPeriod();
  }

  budgetString(budget) {
    return budget.name + ' (' + budget.currency.name + ')';
  }

  budgetTap(budget) {
    this.timeframeService.isCurrentBudget(budget) || this.timeframeService.selectBudget(budget);
  }

  budgetTapAll() {
    this.timeframeService.isCurrentBudget() || this.timeframeService.selectBudget();
  }
}
