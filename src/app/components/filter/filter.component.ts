import { take, skip } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable ,  ReplaySubject, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FilterService } from '../../core/services/filter.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() properties: any;

  public current: ReplaySubject<any> = new ReplaySubject<any>(1);
  public _current: any = null;
  public defaultOption: any = new ReplaySubject<any>(1);
  public _defaultOption: any = null;
  public _options: any = undefined;
  public property: string;
  public title: string;
  public parameter: string;
  public mobileIcon: string;
  public currentString: Function = function(current) { return this.optionString(current); };
  public optionValue: Function = function(option) { return option; };
  public optionString: Function = function(option) { return option; };
  public defaultObject: Function = function(defaultObject) { return defaultObject; };
  public combinedObservable;
  public initialised = false;
  public lastValue: any = undefined;
  public currentSubscribe: any;
  public defaultSubscribe: any;
  public optionsSubscribe: any;
  public debug: boolean = false;
  public paramsSubscribe: any;
  public options: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  public subscriptions: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private cdRef : ChangeDetectorRef,
  ) {
    // Inform filter service about current URL
    filterService.setUrl(router.url);
  }

  ngOnDestroy() {
    this.currentSubscribe.unsubscribe();
    this.defaultSubscribe && this.defaultSubscribe.unsubscribe();
    this.optionsSubscribe.unsubscribe();
    this.paramsSubscribe.unsubscribe();
    this.subscriptions && this.subscriptions.forEach((elem) => { elem.unsubscribe(); });
    this.filterService.resetParams();
  }

  ngOnInit() {
    // Copy specific properties to local variables
    ['defaultObject', 'currentString', 'optionValue', 'optionString', 'title', 'property', 'subscriptions', 'mobileIcon'].forEach(function(v) {
      if (this.properties[v]) {
        this[v] = this.properties[v];
      }
    }.bind(this));

    this.debug && console.log(this.property + ": Initialzing filter");

    this.paramsSubscribe = this.route.queryParams.subscribe(
      params => {
        this.debug && console.log(this.property + ": GOT URL PARAMS", params);
      }
    );

    // Expose current observable, so filter variables can be set programatically from outside
    this.properties['current'] = this.current;

    // Initialise everything
    this.properties.options.pipe(take(1)).subscribe(options => {
      this.debug && console.log(this.property + ": Options received.", options);
      // Initialise options
      this._options = options;
      this.options.next(options);
      this.cdRef.detectChanges();

      // If default option is defined, we should wait for it before proceeding,
      // so we have it assigned.
      const a = new ReplaySubject<any>(1);
      if (this.properties.defaultObservable) {
        this.debug && console.log(this.property + ": default observable defined, waiting for default object");
        this.properties.defaultObservable.pipe(take(1)).subscribe(defaultObject => {
          this.debug && console.log(this.property + ": default object received, proceeding.", defaultObject);
          this._defaultOption = this.defaultObject(defaultObject);
          a.next(true);
        });
      } else {
        this.debug && console.log(this.property + ": default observable not defined, proceeding.");
        a.next(true);
      }

      // Once options and default are here, we can proceed.
      a.pipe(take(1)).subscribe(b => {
        this.debug && console.log(this.property + ": Options and default value arrived, proceeding.");
        // Take snapshot on URL parameters, this controls what we do next
        this.route.queryParams.pipe(take(1)).subscribe(params => {
          const queryParams: Params = Object.assign({}, params);
          this.debug && console.log(this.property + ": Query params:", queryParams);
          this.debug && console.log(this.property + ": URL: ", this.route.snapshot.url);
          let next;

          switch (queryParams[this.property]) {
            case '': {
              this.debug && console.log(this.property + ": query params explicitly empty.");
              next = '';
              break;
            }
            case undefined: {
              this.debug && console.log(this.property + ": query params not defined, ignoring.");
              next = this._defaultOption;
              break;
            }
            default: {
              this.debug && console.log(this.property + ": looking for object by id from query params...");
              next = this.getObjectById(queryParams[this.property]);
              break;
            }
          }
          this.debug && console.log(this.property + ": Pushing new current based on query params", next);
          this.current.next(next);
        });
      });
    });

    // If new option should be displayed, perform some checks and trigger filter
    this.currentSubscribe = this.current.subscribe(current => {
      this.debug && console.log(this.property + ": New current received from subscription", current);
      let newCurrent = current;
      // If requested option is not available
      if (!this.isOptionAvailable(current)) {
        // Check if requested option is default option
        if (this.optionValue(current) === this.optionValue(this._defaultOption)) {
          this.debug && console.log(this.property + ": New current is a default option.");
          if (!this.isOptionAvailable(this._defaultOption)) {
            this.debug && console.log(this.property + ": New current not available in options!");
            newCurrent = null;
          } else {
            this.debug && console.log(this.property + ": New current available in options, setting as new value");
            newCurrent = this._defaultOption;
          }
        } else {
          this.debug && console.log(this.property + ": New current is NOT a default option.");
          newCurrent = null;
        }
      } else {
        this.debug && console.log(this.property + ": New current available in options.");
      }

      this._current = newCurrent;
      this.cdRef.detectChanges();
      this.debug && console.log(this.property + ": Calling filter with new current", this._current);
      this.filter(this._current);
    });

    // If options changed, assign them and trigger refresh of current to
    // verify if new options still contains it
    this.optionsSubscribe = this.properties.options.pipe(skip(1)).subscribe(options => {
      this.debug && console.log(this.property + ": Options changed, checking for differences.", options);
      if (this.areDifferentByIds(options, this._options)) {
        this._options = options;
        this.options.next(options);
        this.cdRef.detectChanges();
        this.debug && console.log(this.property + ": Options differs, pushing new current.", this._current);
        this.current.next(this._current);
      } else {
        this.debug && console.log(this.property + ": Options are the same, skipping.");
      }
    });

    if (this.properties.defaultObservable) {
      this.defaultSubscribe = this.properties.defaultObservable.pipe(skip(1)).subscribe(defaultObject => {
        if (this._defaultOption != this.defaultObject(defaultObject)) {
          this._defaultOption = this.defaultObject(defaultObject);
          this.debug && console.log(this.property + ": Default option changed, pushing new current.", this._defaultOption);
          this.current.next(this._defaultOption);
        }
      });
    }
  }

  // Accepts filter object or null or ''
  // This function emits final state of new filter
  // Sets correct url and emits new value to observable
  filter(option) {
    this.debug && console.log(this.property + ": filter, received option", option);

    // Take snapshot of current URL parameter, so we can adjust them
    let value;
    let queryParam;

    switch (option) {
      // Empty option should force to show all options
      case '': {
        this.debug && console.log(this.property + ": filter: option is empty string.");
        // If default option is defined, set URL parameter explicitly to empty
        // Otherwise just remove URL parameter
        if (this._defaultOption) {
          this.debug && console.log(this.property + ": filter: default is defined, so we set explicit empty string");
          queryParam = '';
          value = '';
        } else {
          this.debug && console.log(this.property + ": filter: default is NOT defined, removing query string");
          queryParam = null;
          value = null;
        }
        break;
      }
      // Null option should reset to default value
      case null: {
        this.debug && console.log(this.property + ": filter: option is null.");
        queryParam = null;
        value = null;
        break;
      }
      // By default, assume it's an object
      default: {
        this.debug && console.log(this.property + ": filter: options is object.");
        queryParam = this.optionValue(option);
        value = option;
      }
    }

    // If something changed with URL parameters, navigate to it
    this.router.navigate([], { queryParams: this.filterService.appendToParams(this.property, queryParam) });

    // If value changed, emit it
    const nextValue = value ? this.property + '=' + this.optionValue(value) : null;
    if (nextValue !== this.lastValue) {
      this.debug && console.log(this.property + ": filter: value changed, emiting!", nextValue, this.lastValue);
      this.properties.observable.next(nextValue);
      this.lastValue = nextValue;
    } else {
      this.debug && console.log(this.property + ": filter: values didn't change, skipping.");
    }
  }

  isActiveOption(option) {
    return (this.optionValue(option) == this.optionValue(this._current) || (this._current == null && this.optionValue(option) == this.optionValue(this._defaultOption)));
  }

  isActiveAllOption() {
    return (this._current == null && (this._defaultOption == null || (this._options || []).length === 0)) || this._current == '';
  }

  isOptionAvailable(option) {
    if (option === '' || option === null) {
      return true;
    } else {
      // If option is an object, use id propety, otherwise id is passed
      const id = typeof(option) === 'object' ? this.optionValue(option) : option;
      return this.getObjectById(id) !== null;
    }
  }

  getObjectById(id) {
    return (this._options || []).find(option => (this.optionValue(option) == id)) || null;
  }

  queryParamsToString(queryParams) {
    return Object.entries(queryParams).map(function(b) { return b.join('='); }).join('&');
  }

  buttonTitle() {
    if (this._current !== '' && this._current !== null) {
      return this.title + ': ' + this.currentString(this._current);
    } else if (this._defaultOption && this._current !== '' && this._options.length > 0) {
      return this.title + ': ' + this.currentString(this._defaultOption);
    } else {
      return this.title + ': All';
    }
  }

  areDifferentByIds(a, b) {
    const idsA = a ? a.map(x => x.id).reduce((x, y) => x.includes(y) ? x : [...x, y], []).sort() : [];
    const idsB = b ? b.map(x => x.id).reduce((x, y) => x.includes(y) ? x : [...x, y], []).sort() : [];
    return (idsA.join(',') !== idsB.join(','));
  }
}
