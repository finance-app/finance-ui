import { Component } from '@angular/core';
import { AuthService, SessionService, TimeframeService } from '@app/core';

declare const require: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  public navbarCollapsed: boolean = true;

  constructor(
    public auth: AuthService,
    public timeframeService: TimeframeService,
    private sessionService: SessionService,
  ) {}
}
