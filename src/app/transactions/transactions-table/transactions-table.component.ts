import { Component, OnInit, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { Transaction } from '../transaction';

// Services
import { TransactionsService } from '../transactions.service';

import { Table } from '../../components/table/table';

@Component({
  moduleId: module.id,
  selector: 'transactions-table',
  template: '<app-table [rows]="rows" [objects]="transactions" [actions]="actions" [cards]="cards" [card_title]="card_title" [card_subtitle]="card_subtitle" [update]="update"></app-table>',
  styleUrls: ['./transactions-table.component.css'],
})

export class TransactionsTableComponent extends Table implements OnInit {

  @Input() transactions: ReplaySubject<Array<Transaction>>;
  @Input() currencySymbol = '';
  @Input() update;
  @Input() reset;

  public rows = [
    {
      title: this.title.bind(this),
      value: this.value.bind(this),
      ngClass: this.valueNgClass.bind(this),
      routerLink: function(p) { return ['/transactions', p.id]; },
    },
    {
      title: 'Date',
    },
    {
      title: 'Category',
      value: function(p) { return p.transaction_category.name; },
      routerLink: function(p) { return ['/transaction_categories', p.transaction_category.id]; },
    },
    {
      title: 'Source',
      value: function(p) { return p.source ? p.source.name : ''; },
      routerLink: function(p) { return p.source ? [(p.source.model_name == 'Target' ? '/targets' : '/accounts'), p.source.id] : false; },
    },
    {
      title: 'Destination',
      value: function(p) { return p.destination ? p.destination.name : ''; },
      routerLink: function(p) { return p.destination ? [(p.destination.model_name == 'Target' ? '/targets' : '/accounts'), p.destination.id] : false; },
    },
    this.comment_row,
    {
      title: 'Type',
    },
  ];

  public card_title = function(b) { return this.value(b) + (b.destination ? (' to ' + b.destination.name) : '') + ' on ' + b.date; }.bind(this);

  public card_subtitle = function(b) { return b.comment; }

  public cards = [
    {
      title: 'Category',
      value: function(p) { return p.transaction_category.name; },
      routerLink: function(p) { return ['/transaction_categories', p.transaction_category.id]; },
    },
    {
      title: 'Source',
      value: function(p) { return p.source ? p.source.name : ''; },
      routerLink: function(p) { return p.source ? [(p.source.model_name == 'Target' ? '/targets' : '/accounts'), p.source.id] : false; },
    },
    {
      title: 'Destination',
      value: function(p) { return p.destination ? p.destination.name : ''; },
      routerLink: function(p) { return p.destination ? [(p.destination.model_name == 'Target' ? '/targets' : '/accounts'), p.destination.id] : false; },
    },
    {
      title: 'Type',
    },
  ];

  public actions = [
    {
      title: 'Edit',
      icon: 'edit',
      ngClass: function(b) { return {'text-primary': true}; },
      routerLink: function(b) { return ['/transactions', b.id, 'edit']; },
    },
    {
      title: 'Delete',
      icon: 'trash-alt',
      ngClass: function(b) { return {'text-danger': true}; },
      click: this.delete.bind(this),
    }
  ];

  constructor(
    public transactionsService: TransactionsService,
  ) {
    super();
    this.objectsService = transactionsService;
    this.path = '/transactions';
  }

  ngOnInit() {
    this.objects = this.transactions;
  }

  valueNgClass(p: Transaction) {
    return {'text-danger': this.isIncome(p), 'text-success': !this.isIncome(p) };
  }

  value(p: Transaction) {
    return (this.isIncome(p) ? '-' : '+') + p.value + (this.currencySymbol != '' ? (' ' + this.currencySymbol) : '');
  }

  isIncome(transaction: Transaction) {
    return transaction.destination ? (transaction.destination.model_name == 'Target') : (transaction.source.model_name == 'Account');
  }

  title() {
    return "Value" + (this.currencySymbol != '' ? " (" + this.currencySymbol + ")" : '');
  }
}
