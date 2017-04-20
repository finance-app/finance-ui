import * as app from 'application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { IndexCommon } from './index.common';

export class Index extends IndexCommon {
  constructor() {
    super();
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
