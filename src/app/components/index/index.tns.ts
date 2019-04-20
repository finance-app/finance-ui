import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { IndexCommon } from './index.common';
import { ViewChild } from '@angular/core';
import { IndexComponent } from './index.component';

export class Index extends IndexCommon {
  @ViewChild('index', { static: true }) index: IndexComponent;
  @ViewChild('table', { static: true }) table: any;

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
