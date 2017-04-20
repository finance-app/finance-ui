import { Component, Input } from '@angular/core';

// Models
import { Alert } from './alert';

// Services
import { AlertsService } from './alerts.service';

@Component({
  moduleId: module.id,
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {

  public objectKeys = Object.keys;

  constructor(
    public alertsService: AlertsService,
  ) {}

  public closeAlert(alert: string) {
    this.alertsService.removeAlert(alert);
  }
}
