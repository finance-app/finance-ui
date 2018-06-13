import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SessionService, TimeframeService } from '@app/core';

declare const require: any;

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  public navbarCollapsed: boolean = true;

  constructor(
    private translate: TranslateService,
    public auth: AuthService,
    public timeframeService: TimeframeService,
    private sessionService: SessionService,
  ) {
    translate.setTranslation('en', require('../assets/i18n/en.json'));
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
