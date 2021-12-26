import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// nativescript
import { NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
// app
import { Config } from './common/index';
import { AppComponent } from './app.component';
import { SHARED_MODULES } from './app.common';
import { SharedModule } from './shared/shared.module';

import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';

Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        NativeScriptUISideDrawerModule,
        SharedModule,
        ...SHARED_MODULES
    ],
    declarations: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
