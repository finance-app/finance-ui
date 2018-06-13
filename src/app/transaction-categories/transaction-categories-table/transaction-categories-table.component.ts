import { Component, OnInit, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { TransactionCategory } from '../transaction-category';

// Services
import { TransactionCategoriesService } from '../transaction-categories.service';

import { Table } from '../../components/table/table';

@Component({
  moduleId: module.id,
  selector: 'transaction-categories-table',
  template: '<app-table [rows]="rows" [objects]="transactionCategories" [actions]="actions" [cards]="cards" [card_title]="card_title" [card_subtitle]="card_subtitle" [update]="update"></app-table>',
  styleUrls: ['./transaction-categories-table.component.css'],
})

export class TransactionCategoriesTableComponent extends Table implements OnInit {

  @Input() transactionCategories: ReplaySubject<Array<TransactionCategory>>;
  @Input() update;

  public rows = [
    this.name_row,
    this.comment_row,
    {
      title: 'Transactions',
    },
    ...this.balances_rows,
  ];

  public card_title = function(b) { return b.name; }

  public card_subtitle = function(b) { return b.comment; }

  public cards = [
    {
      title: 'Transactions',
    },
    ...this.balances_rows,
  ];

  public actions = [
    {
      title: 'Edit',
      icon: 'edit',
      ngClass: function(b) { return {'text-primary': true}; },
      routerLink: function(b) { return ['/transaction_categories', b.id, 'edit']; },
    },
    {
      title: 'Delete',
      icon: 'trash-alt',
      ngClass: function(b) { return {'text-danger': true}; },
      click: this.delete.bind(this),
    }
  ];

  constructor(
    public transactionCategoriesService: TransactionCategoriesService,
  ) {
    super();
    this.objectsService = transactionCategoriesService;
    this.path = '/transaction_categories';
  }

  ngOnInit() {
    this.objects = this.transactionCategories;
  }
}
