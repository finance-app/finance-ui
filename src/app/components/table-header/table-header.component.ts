import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css'],
})

export class TableHeaderComponent {

  public filtersCollapsed = false;

  @Input() path: string;
  @Input() filters: any;
  @Input() update: any;
  @Input() reset: any;

  constructor() { }
}
