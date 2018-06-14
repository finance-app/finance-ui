import { Component, OnInit, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { Target } from '../target';

// Services
import { TargetsService } from '../targets.service';

import { Table } from '../../components/table/table';

@Component({
  moduleId: module.id,
  selector: 'targets-table',
  template: '<app-table [rows]="rows" [objects]="targets" [actions]="actions" [cards]="cards" [card_title]="card_title" [card_subtitle]="card_subtitle" [active_row]="active_row.bind(this)" [active_row_class]="active_row_class.bind(this)" [active_row_text]="active_row_text" [active_row_text_class]="active_row_text_class" [update]="update"></app-table>',
  styleUrls: ['./targets-table.component.css'],
})

export class TargetsTableComponent extends Table implements OnInit {

  @Input() targets: ReplaySubject<Array<Target>>;
  @Input() update;

  public rows = [
    this.name_row,
    this.comment_row,
    {
      title: 'Transactions',
    },
    ...this.balances_rows,
    {
      title: 'Income Category',
      value: function(p) { return p.default_income_transaction_category ? p.default_income_transaction_category.name : ''; },
      routerLink: function(p) { return p.default_income_transaction_category ? ['/transaction_categories', p.default_income_transaction_category.id] : false; },
    },
    {
      title: 'Expense Category',
      value: function(p) { return p.default_expense_transaction_category ? p.default_expense_transaction_category.name : ''; },
      routerLink: function(p) { return p.default_expense_transaction_category ? ['/transaction_categories', p.default_expense_transaction_category.id] : false; },
    },
  ];

  public card_title = function(b) { return b.name; }

  public card_subtitle = function(b) { return b.comment; }

  public cards = [
    ...this.balances_rows,
    {
      title: 'Income Category',
      value: function(p) { return p.default_income_transaction_category ? p.default_income_transaction_category.name : ''; },
      routerLink: function(p) { return p.default_income_transaction_category ? ['/transaction_categories', p.default_income_transaction_category.id] : false; },
    },
    {
      title: 'Expense Category',
      value: function(p) { return p.default_expense_transaction_category ? p.default_expense_transaction_category.name : ''; },
      routerLink: function(p) { return p.default_expense_transaction_category ? ['/transaction_categories', p.default_expense_transaction_category.id] : false; },
    },
  ];

  public actions = [
    {
      title: function(b) { return b.favourite ? 'Remove from Favourite' : 'Add to Favourite' },
      icon: 'star',
      click: function(b) { return this.targetsService.favourite(b, !b.favourite); }.bind(this),
      ngClass: function(b) { return {'text-warning': true}; },
    },
    {
      title: 'Edit',
      icon: 'edit',
      ngClass: function(b) { return {'text-primary': true}; },
      routerLink: function(b) { return ['/targets', b.id, 'edit']; },
    },
    {
      title: 'Delete',
      icon: 'trash-alt',
      ngClass: function(b) { return {'text-danger': true}; },
      click: this.delete.bind(this),
    }
  ];

  public active_row_text_class: any = {
    'text-black': true,
    'bg-warning': true,
  }

  public active_row_text = 'Favourite';

  constructor(
    public targetsService: TargetsService,
  ) {
    super();
    this.objectsService = targetsService;
    this.path = '/targets';
  }

  ngOnInit() {
    this.objects = this.targets;
  }

  active_row(b) {
    return b.favourite;
  }

  active_row_class(b, card) {
    return card ? {'border-warning': b.favourite} : {'table-warning': b.favourite};
  }
}
