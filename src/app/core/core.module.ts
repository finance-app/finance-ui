import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@melonwd/angular-jwt';

// Environment
import { environment } from '@env/environment';

// Modules with forRoot
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponsiveModule } from 'ngx-responsive';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Make sure that we only import core module only once
import { throwIfAlreadyLoaded } from './module-import-guard';

import { IMPORTS, DECLARATIONS, EXPORTS, PROVIDERS, ENTRY_COMPONENTS } from './core.common';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenCookie);
}

@NgModule({
  imports: [
    ...IMPORTS,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    ResponsiveModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: environment.blacklistedRoutes
      }
    }),
  ],
  declarations: [
    ...DECLARATIONS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ],
  exports: [
    ...EXPORTS,
    NgbModule,
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    library: FaIconLibrary,
  ) {
    library.addIconPacks(fas);
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
};
