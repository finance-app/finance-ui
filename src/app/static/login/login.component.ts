import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../core/services/auth.service';
import { AlertsService } from '../../core/alerts/alerts.service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public submitted = false;
  public inProgress = false;
  public formGroup: FormGroup;

  private returnUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertsService: AlertsService,
  ) {}

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
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  submit() {
    this.inProgress = true;
    this.submitted = true;
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value)
        .subscribe(
          data => {
            this.router.navigateByUrl(this.returnUrl);
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
}
