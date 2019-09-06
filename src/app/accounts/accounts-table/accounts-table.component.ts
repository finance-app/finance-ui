import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Models
import { Account } from '../account';

// Services
import { AccountsService } from '../accounts.service';

import { Table } from '../../components/table/table';
import { TableComponent } from '../../components/table/table.component';

@Component({
  moduleId: module.id,
  selector: 'accounts-table',
  template: `<app-table [rows]="rows" [objects]="accounts" [actions]="actions" [cards]="cards" [card_title]="card_title" [update]="update" #appTable></app-table>`,
  styleUrls: ['./accounts-table.component.css'],
})

export class AccountsTableComponent extends Table implements OnInit {

  @Input() accounts: ReplaySubject<Array<Account>>;
  @Input() update: any;
  @ViewChild('appTable', { static: true }) appTable: TableComponent;

  public rows = [
    this.name_row,
    this.comment_row,
    ...this.balances_rows,
    {
      title: 'Current balance',
      value: this.currentBalanceValue.bind(this),
      ngClass: this.currentBalanceNgClass.bind(this),
    },
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
      title: 'Current balance',
      value: this.currentBalanceValue.bind(this),
      ngClass: this.currentBalanceNgClass.bind(this),
      visible: function(object) { return object.current_balance !== undefined && object.current_balance !== "0.0" },
    },
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

  currentBalanceValue(b) {
    return b.current_balance ? (b.current_balance > 0 ? '+' + b.current_balance : b.current_balance) : '0.0';
  }

  currentBalanceNgClass(b) {
    return {'text-success': b.current_balance > 0, 'text-danger': b.current_balance < 0, 'bg-success-transparent': b.current_balance > 0, 'bg-danger-transparent': b.current_balance < 0, };
  }
}
