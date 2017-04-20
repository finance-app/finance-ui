import { mergeMap, map, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export abstract class LocationCommon {

  public events: Subject<string> = new Subject<string>();

  private started = false;
  private title: string = null;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    location.subscribe(
      event => {
        this.startEvent();
      }
    );

    router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.startEvent();
        } else if (event instanceof NavigationEnd) {
          this.finishEvent();
        }
    });

    // Manage dynamic app titles
    this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.activatedRoute),
    map((route: ActivatedRoute) => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    filter((route: ActivatedRoute) => route.outlet === 'primary'),
    mergeMap((route: ActivatedRoute) => route.data), )
    .subscribe((event) => {
      let title = null;

      if (event['title']) {
        title = event['title']
      } else {
        title = 'Finance';
      }

      this.setTitle(title);
    });
  }

  abstract setTitle(title: string);

  back() {
    this.startEvent();
    this.location.back();
  }

  startEvent() {
    if (!this.started) {
      this.started = true;
      this.events.next('start');
    }
  }

  finishEvent() {
    if (this.started) {
      this.started = false;
      this.events.next('finish');
    }
  }
}
