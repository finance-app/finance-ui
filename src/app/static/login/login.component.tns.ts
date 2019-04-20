import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../core/services/auth.service';
import { AlertsService } from '../../core/alerts/alerts.service';

import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  public submitted = false;
  public inProgress = false;
  public formGroup: FormGroup;
  private returnUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertsService: AlertsService,
    private routerExtensions: RouterExtensions,
    private page: Page,
  ) {
    page.actionBarHidden = true;
  }

  ngAfterViewInit() {
    // After view init disable access to menu
    // setTimeout is a workaround for undefined sideDrawer
    // Maybe this should be moved to auth or session service
    setTimeout(() => {
      const sideDrawer = <RadSideDrawer>app.getRootView();
      sideDrawer.gesturesEnabled = false;
      sideDrawer.closeDrawer();
    }, 100);
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
      ]),
      password: new FormControl(null, [
        Validators.required,
      ]),
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.loggedIn()) {
      this.routerExtensions.navigateByUrl(this.returnUrl, { clearHistory: true });
    }
  }

  submit() {
    this.inProgress = true;
    this.submitted = true;
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value)
        .subscribe(
          data => {
            this.routerExtensions.navigateByUrl(this.returnUrl, { clearHistory: true });
          },
          error => {
            this.inProgress = false;
          },
      );
    } else {
      this.inProgress = false;
    }
  }

  isInvalid(field) {
    return this.formGroup.controls[field].invalid && (this.formGroup.controls[field].dirty || this.submitted);
  }

  isValid(field) {
    return !this.formGroup.controls[field].invalid && (this.formGroup.controls[field].dirty || this.submitted);
  }

  ngOnDestroy() {
    // On destroy re-access to menu
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.gesturesEnabled = true;
  }
}
