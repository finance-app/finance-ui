import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { LocationCommon } from './location.common';

@Injectable()
export class LocationService extends LocationCommon {

  constructor(
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(_location, _router, _activatedRoute);
  }

  setTitle(title: string) {
    // This should be implemented
  }
}
