import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class IndexComponent {

  public filtersCollapsed = true;

  @Input() title: string;

  constructor() { }
}
