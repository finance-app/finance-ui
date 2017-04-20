import { Component } from '@angular/core';
import * as app from 'application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  moduleId: module.id,
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  constructor() {}

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
