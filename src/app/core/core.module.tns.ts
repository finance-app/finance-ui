import { NgModule, Optional, SkipSelf, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptHttpClientModule } from '@nativescript/angular';
import { JwtModule } from '@melonwd/angular-jwt';

// Environment
import { environment } from '../../environments';

// Modules with forRoot
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';

// Make sure that we only import core module only once
import { throwIfAlreadyLoaded } from './module-import-guard';

import { IMPORTS, DECLARATIONS, EXPORTS, PROVIDERS, ENTRY_COMPONENTS } from './core.common';

export function tokenGetter() {
  // Workaround for calling split on undefined in jwt module
  return ApplicationSettings.getString(environment.tokenCookie) || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjAsInN1YiI6MX0.lNGignAeNQQdBwJW9EA2riW7sZimJ5f7OXer4gNU81w';
}

import { ApplicationSettings } from '@nativescript/core';

@NgModule({
  imports: [
    ...IMPORTS,
    NativeScriptHttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: environment.blacklistedRoutes
      }
    }),
    TNSFontIconModule.forRoot({
      'fa': './fonts/fontawesome.css',
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
  ],
  providers: [
    ...PROVIDERS
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
