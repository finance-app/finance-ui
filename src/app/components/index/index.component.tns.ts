import * as app from 'application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class IndexComponent implements OnInit {

  @Input() title: string;
  @Input() filters;

  @ViewChild('filtersDrawer') drawerRef: ElementRef;
  private drawer: RadSideDrawer;

  constructor() { }

  ngOnInit() {
    this.drawer = <RadSideDrawer>this.drawerRef.nativeElement;
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
