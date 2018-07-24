import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { Budget } from '../budget';

// Services
import { BudgetsService } from '../budgets.service';
import { TimeframeService } from '../../core/services/timeframe.service';

import { Table } from '../../components/table/table';

@Component({
  moduleId: module.id,
  selector: 'budgets-table',
  template: '<app-table [rows]="rows" [objects]="budgets" [actions]="actions" [active_row]="active_row.bind(this)" [cards]="cards" [card_title]="card_title" [card_subtitle]="card_subtitle" [update]="update"></app-table>',
  styleUrls: ['./budgets-table.component.css'],
})

export class BudgetsTableComponent extends Table implements OnInit {

  @Input() budgets: ReplaySubject<Array<Budget>>;
  @Input() update: any;

  public rows = [
    this.name_row,
    this.comment_row,
    ...this.balances_rows,
    {
      title: 'Currency',
      value: function(b) { return b.currency.name; },
      routerLink: function(b) { return ['/currencies', b.currency.id] },
    },
    {
      title: 'Default account',
      value: function(b) { return b.default_account ? b.default_account.name + ' (' + b.default_account.currency.name + ')' : ''; },
      routerLink: function(b) { return b.default_account ? ['/accounts', b.default_account.id] : false; },
    },
  ];

  public card_title = function(b) { return b.name; }

  public card_subtitle = function(b) { return b.comment; }

  public cards = [
    ...this.balances_rows,
    {
      title: 'Currency',
      value: function(b) { return b.currency.name; },
      routerLink: function(b) { return ['/currencies', b.currency.id] },
    },
    {
      title: 'Default account',
      value: function(b) { return b.default_account ? b.default_account.name : ''; },
      routerLink: function(b) { return b.default_account ? ['/accounts', b.default_account.id] : false; },
    },
  ];

  public actions = [
    {
      title: function(b) { return this.timeframeService.isCurrentBudget(b) ? 'Deselect' : 'Select' }.bind(this),
      icon: 'check',
      click: function(b) { return this.timeframeService.isCurrentBudget(b) ? this.timeframeService.selectBudget() : this.timeframeService.selectBudget(b) }.bind(this),
      ngClass: function(b) { return {'text-success': true}; },
    },
    {
      title: 'Edit',
      icon: 'edit',
      ngClass: function(b) { return {'text-primary': true}; },
      routerLink: function(b) { return ['/budgets', b.id, 'edit']; },
    },
    {
      title: 'Delete',
      icon: 'trash-alt',
      ngClass: function(b) { return {'text-danger': true}; },
      click: this.delete.bind(this),
    }
  ];

  constructor(
    public timeframeService: TimeframeService,
    public budgetsService: BudgetsService,
  ) {
    super();
    this.objectsService = budgetsService;
    this.path = '/budgets';
  }

  ngOnInit() {
    this.objects = this.budgets;
  }

  active_row(b) {
    return this.timeframeService.isCurrentBudget(b);
  }
}
