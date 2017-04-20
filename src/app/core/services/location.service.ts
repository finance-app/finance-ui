import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LocationCommon } from './location.common';

@Injectable()
export class LocationService extends LocationCommon {

  constructor(
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {
    super(_location, _router, _activatedRoute);
  }

  setTitle(title: string) {
    this.titleService.setTitle(title + ' - Finance');
  }
}
