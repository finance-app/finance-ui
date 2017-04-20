import { Component, OnInit, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { CurrenciesService } from '../currencies.service';

import { Currency } from '../currency';
import { Table } from '../../components/table/table';

@Component({
  moduleId: module.id,
  selector: 'currencies-table',
  templateUrl: './currencies-table.component.html',
  styleUrls: ['./currencies-table.component.css']
})
export class CurrenciesTableComponent extends Table implements OnInit {

  @Input() currencies: ReplaySubject<Array<Currency>>;
  @Input() update: any;

  public rows = [
    this.name_row,
    {
      title: 'Symbol',
    },
    {
      title: 'Budgets',
      routerLink: function(c) { return ['/budgets'] },
      queryParams: function(c) { return {currency_id: c.id} },
    },
    {
      title: 'Accounts',
      routerLink: function(c) { return ['/accounts'] },
      queryParams: function(c) { return {currency_id: c.id} },
    },
    ...this.balances_rows,
  ];

  public cards = [
    {
      title: 'Budgets',
      routerLink: function(c) { return ['/budgets'] },
      queryParams: function(c) { return {currency_id: c.id} },
    },
    {
      title: 'Accounts',
      routerLink: function(c) { return ['/accounts'] },
      queryParams: function(c) { return {currency_id: c.id} },
    },
    ...this.balances_rows,
  ];

  public card_title = function(c) { return c.name + ' (' + c.symbol + ')'; }

  public actions = [
    {
      title: 'Edit',
      icon: 'edit',
      ngClass: function(c) { return {'text-primary': true}; },
      routerLink: function(c) { return ['/currencies', c.id, 'edit']; },
    },
    {
      title: 'Delete',
      icon: 'trash-alt',
      ngClass: function(c) { return {'text-danger': true}; },
      click: this.delete.bind(this),
      disabled: function(c) { return (c.accounts + c.budgets) != 0; },
    }
  ];

  constructor(
    public currenciesService: CurrenciesService,
  ) {
    super();
    this.objectsService = currenciesService;
    this.path = '/currencies';
  }

  ngOnInit() {
    this.objects = this.currencies;
  }
}
