import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// app
import { Config } from './common/index';
import { AppComponent } from './app.component';
import { SHARED_MODULES } from './app.common';

Config.PLATFORM_TARGET = Config.PLATFORMS.WEB;

@NgModule({
    declarations: [ AppComponent ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ...SHARED_MODULES
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
