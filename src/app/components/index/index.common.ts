import { HttpParams } from '@angular/common/http';
import { combineLatest as observableCombineLatest, ReplaySubject, Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

export class IndexCommon {

  public currentParams: Array<any>;
  public objects: any;
  public objectsService: any;
  public filters: any;
  public subscriptions: Array<Subscription> = [];
  public getAllSubscription: any = null;

  constructor() { }

  ngOnInit() {
    // If there is at least one filter defined, wait for it to produce and subscribe to future updates
    if (this.filters.length > 0) {
      this.subscriptions.push(observableCombineLatest(...this.filters.map(function(f) { return f.observable })).subscribe(
        params => {
          const params_joined = params.filter(function(v) { return v != null }).join('&');
          if (this.currentParams === undefined || params_joined != this.currentParams.filter(function(v) { return v != null }).join('&')) {
            this.getAll(params);
            this.currentParams = params;
          }
        },
      ));
    } else {
      // If there is no filters, just fetch all once
      this.getAll();
    }
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
    return new HttpParams({
      fromString: params.filter(function(v) { return v != null }).join('&')
    });
  }

  update(): ReplaySubject<any> {
    return this.getAll(this.currentParams);
  }

  push(item: any) {
    this.subscriptions.push(item);
  }
}
