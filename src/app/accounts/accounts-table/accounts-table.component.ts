import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { Account } from '../account';

// Services
import { AccountsService } from '../accounts.service';

import { Table } from '../../components/table/table';

@Component({
  moduleId: module.id,
  selector: 'accounts-table',
  template: `<app-table [rows]="rows" [objects]="accounts" [actions]="actions" [cards]="cards" [card_title]="card_title" [update]="update" #appTable></app-table>`,
  styleUrls: ['./accounts-table.component.css'],
})

export class AccountsTableComponent extends Table implements OnInit {

  @Input() accounts: ReplaySubject<Array<Account>>;
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
      title: 'Type',
    },
    {
      title: 'Provider',
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
      title: 'Type',
    },
    {
      title: 'Provider',
    },
  ];

  public actions = [
    {
      title: 'Correct',
      icon: 'wrench',
      ngClass: function(b) { return {'text-warning': true}; },
      routerLink: function(b) { return ['/accounts', b.id, 'correct']; },
    },
    {
      title: 'Transfer from...',
      icon: 'arrow-right',
      ngClass: function(b) { return {'text-secondary': true}; },
      routerLink: function(b) { return ['/accounts', 'transfer']; },
      queryParams: function(b) { return { source_id: b.id }; },
    },
    {
      title: 'Transfer to...',
      icon: 'arrow-left',
      ngClass: function(b) { return {'text-success': true}; },
      routerLink: function(b) { return ['/accounts', 'transfer']; },
      queryParams: function(b) { return { destination_id: b.id }; },
    },
    {
      title: 'Edit',
      icon: 'edit',
      ngClass: function(b) { return {'text-primary': true}; },
      routerLink: function(b) { return ['/accounts', b.id, 'edit']; },
    },
    {
      title: 'Delete',
      icon: 'trash-alt',
      ngClass: function(b) { return {'text-danger': true}; },
      click: this.delete.bind(this),
    }
  ];

  constructor(
    public accountsService: AccountsService,
  ) {
    super();
    this.objectsService = accountsService;
    this.path = '/accounts';
  }

  ngOnInit() {
    this.objects = this.accounts;
  }
}
