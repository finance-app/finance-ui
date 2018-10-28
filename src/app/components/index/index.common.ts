import { combineLatest as observableCombineLatest, ReplaySubject, Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

export class IndexCommon {

  public currentParams: Array<any>;
  public objects: any;
  public objectsService: any;
  public filters: any;
  public subscriptions: Array<Subscription> = [];
  public getAllSubscription: any = null;
  private getUpdates: boolean = true;

  constructor() { }

  ngOnInit() {
    // If there is at least one filter defined, wait for it to produce and subscribe to future updates
    if (this.filters.length > 0) {
      this.subscriptions.push(observableCombineLatest(...this.filters.map(function(f) { return f.observable })).subscribe(
        params => {
          const filtered_params = this.filterParams(params);
          if (this.currentParams === undefined || filtered_params.join('&') != this.filterParams(this.currentParams).join('&')) {
            this.getUpdates && this.getAll(filtered_params);
            this.currentParams = filtered_params;
          }
        },
      ));
    } else {
      // If there is no filters, just fetch all once
      this.getUpdates && this.getAll();
    }
  }

  reset() {
    if (this.filters.length > 0) {
      this.getUpdates = false;
      for (let i=0; i<this.filters.length; i++) {
        let filter = this.filters[i];
        if (filter.defaultObservable) {
          filter.defaultObservable.pipe(take(1)).subscribe(value => {
            let new_value = typeof filter.defaultObject === 'function' ? filter.defaultObject(value) : value;
            filter.current.next(new_value);
          });
        } else {
          filter.current.next(null);
        }
      }
      this.getAll(this.currentParams);
      this.getUpdates = true;
    }
  }

  filterParams(params) {
    return params.filter(function(v) { return v != null });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((elem) => { elem.unsubscribe(); });
  }

  getAll(params = []): ReplaySubject<any> {
    const subject = new ReplaySubject<any>(1);
    // Build all query params
    const options = this.options(params);

    // Cancel previous subscription if one exists
    if (this.getAllSubscription !== null) {
      this.getAllSubscription.unsubscribe();
      this.getAllSubscription = null;
    }

    // Fetch objects and assign them
    this.getAllSubscription = this.objectsService.getAll(options).pipe(finalize(() => subject.complete())).subscribe(
      objects => {
        this.objects.next(objects);
        subject.next(objects);
      },
      error => {
        subject.error(error);
      }
    );

    return subject;
  };

  options(params = []) {
    return params.filter(function(v) { return v != null }).join('&');
  }

  update(): ReplaySubject<any> {
    return this.getAll(this.currentParams);
  }

  push(item: any) {
    this.subscriptions.push(item);
  }
}
