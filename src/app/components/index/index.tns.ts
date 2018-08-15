import * as app from 'application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { IndexCommon } from './index.common';
import { ViewChild } from '@angular/core';
import { IndexComponent } from './index.component';

export class Index extends IndexCommon {
  @ViewChild('index') index: IndexComponent;

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
