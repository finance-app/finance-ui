import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { CapitalizePipe } from './pipes/capitalize.pipe';

@NgModule({
  declarations: [
    CapitalizePipe,
  ],
  exports: [
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptCommonModule,
    TNSFontIconModule,
    CapitalizePipe,
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }
