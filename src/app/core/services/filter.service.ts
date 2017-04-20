import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Injectable()
export class FilterService {

  private queryParams: Params = {};
  private currentRoute: string;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
  }

  setUrl(url: string) {
    let url_array = url.split('?');
    if (url_array[0] != this.currentRoute) {
      this.currentRoute = url_array[0];
      this.queryParams = {};
    }

    if (url_array[1]) {
      let params = url_array[1].split('&');
      for (let param of params) {
        let param_array = param.split('=');
        this.queryParams[param_array[0]] = param_array[1];
      }
    }
  }

  appendToParams(key, value): Params {
    if (value === null) {
      delete this.queryParams[key];
    } else {
      this.queryParams[key] = value;
    }
    return this.queryParams;
  }
}
