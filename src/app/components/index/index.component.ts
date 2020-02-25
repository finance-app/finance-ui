import { Component, Input } from '@angular/core';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class IndexComponent {

  public filtersCollapsed = true;

  @Input() title: string;
  @Input() filters;

  constructor() { }
}
