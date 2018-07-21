import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableComponent implements OnInit, OnDestroy {

  @Input() rows: Array<any>;
  @Input() objects: ReplaySubject<Array<any>>;
  @Input() actions: Array<any>;
  @Input() active_row: any;
  @Input() cards: Array<any>;
  @Input() card_title: any;
  @Input() card_subtitle: any;
  @Input() update: any;
  @Input() active_row_class: any;
  @Input() active_row_text: any;
  @Input() active_row_text_class: any;

  public elements: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  private objects_subscription: any;
  public sort_status: any = {};
  public sort_title: string = 'None';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    // Evaluate all row titles
    for (let i=0; i<this.rows.length; i++) {
      let row = this.rows[i];
      row.title = this.evaluate(row.title);
    }

    this.objects_subscription = this.objects.subscribe(
      objects => {
        this.sort_status = {};
        for (let i=0; i<objects.length; i++) {
          let object = objects[i];
          object.rows = [];
          object.actions = [];
          object.cards = [];
          object.card_title = this.card_title && this.card_title(object);
          object.card_subtitle = this.card_subtitle && this.card_subtitle(object);

          for (let i=0; i<this.rows.length; i++) {
            let row = this.rows[i];
            object.rows.push({
              routerLink: row.routerLink && row.routerLink(object),
              queryParams: row.queryParams ? row.queryParams(object) : {},
              ngClass: row.ngClass ? row.ngClass(object) : {},
              value: this.value(row, object),
            });
          }

          for (let i=0; i<this.actions.length; i++) {
            let action = this.actions[i];
            object.actions.push({
              ngClass: action.ngClass ? action.ngClass(object) : {},
              disabled: action.disabled ? action.disabled(object) : false,
              routerLink: action.routerLink && action.routerLink(object),
              queryParams: action.queryParams && action.queryParams(object),
              //title: this.evaluate(action.title, object),
              title: action.title,
              icon: action.icon,
              click: function(c) { action.click && action.click(c); },
            });
          }

          for (let i=0; i<this.cards.length; i++) {
            let card = this.cards[i];
            object.cards.push({
              title: this.evaluate(card.title),
              value: this.value(card, object),
              queryParams: card.queryParams ? card.queryParams(object) : {},
              ngClass: card.ngClass ? card.ngClass(object) : {},
            });
          }
        }

        this.elements.next(objects);

        this.route.queryParams.pipe(take(1)).subscribe(queryParams => {
          const by = queryParams['order_by'];
          if (by && by != '') {
            const row = this.rows.find(r => r.title === by.charAt(0).toUpperCase() + by.slice(1));
            row && this.sortBy(row, queryParams['order'] !== 'asc');
          }
        });
      }
    );
  }

  ngOnDestroy() {
    this.objects_subscription.unsubscribe();
  }

  value(row, object) {
    // First we check if row.value is a function or not
    if (typeof row.value === 'function') {
      // If yes, evaluate and return
      return row.value(object);
    } else {
      // Try just returning property of object
      return object[row.title.toLowerCase()];
    }
  }

  evaluate(property, object?) {
    return typeof property === 'function' ? property(object) : property;
  }

  trackById(index, object) {
    return object.id;
  }

  onPullToRefreshInitiated(args) {
    this.update().subscribe(data => args.object.notifyPullToRefreshFinished(), error => args.object.notifyPullToRefreshFinished());
  }

  sortBy(row, order?: boolean) {
    let control = (order === undefined) ? (this.sort_status[row.title] === undefined ? false : !this.sort_status[row.title]) : order;
    this.elements.pipe(take(1)).subscribe(elements => {
      elements.sort((l, r): number => {
        let lv = this.value(row, l) || '';
        lv = Number(lv) || lv.toLowerCase();
        let rv = this.value(row, r) || '';
        rv = Number(rv) || rv.toLowerCase();
        if (lv < rv) return control ? 1 : -1;
        if (lv > rv) return control ? -1 : 1;
        return 0;
      });
    });
    this.sort_status = {};
    this.sort_status[row.title] = control;
    this.sort_title = row.title + (!control ? ' ASC' : ' DESC');

    this.route.queryParams.pipe(take(1)).subscribe(params => {
      const queryParams: Params = Object.assign({}, params);
      queryParams['order'] = control ? 'desc' : 'asc';
      queryParams['order_by'] = row.title.toLowerCase();
      this.router.navigate([], { queryParams: queryParams });
    });
  }

  sortIcon(row) {
    switch(this.sort_status[row.title]) {
      case undefined: return 'sort';
      case true: return 'sort-down';
      default: return 'sort-up';
    }
  }
}
