import * as app from 'tns-core-modules/application';
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
  @Input() reset: any;
  @Input() table: any;

  @ViewChild('filtersDrawer', { static: true }) drawerRef: ElementRef;
  private drawer: RadSideDrawer;
  public options: Array<any> = [];
  public sortCurrent: any = null;

  constructor() { }

  ngOnInit() {
    this.drawer = <RadSideDrawer>this.drawerRef.nativeElement;
    let options = [];
    for (let i = 0; i < this.table.rows.length; i++) {
      let row = this.table.rows[i];
      let title = typeof row.title === 'function' ? row.title() : row.title;

      options.push({
        title: title + ' ASC',
        value: [row, false],
      });
      options.push({
        title: title + ' DESC',
        value: [row, true],
      });
    }
    this.options = options;
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  optionString(option) {
    return option.title;
  }

  optionValue(option) {
    return option ? option.value : option;
  }

  sortBy(option) {
    this.sortCurrent = option;
    if (option.value) {
      this.table.appTable.sortBy(option.value[0], option.value[1]);
    } else {
      this.table.appTable.resetSorting();
    }
  }
}
