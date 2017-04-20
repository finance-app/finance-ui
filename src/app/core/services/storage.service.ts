import { Injectable } from '@angular/core';

import { StorageCommon } from './storage.common';

@Injectable()
export class StorageService extends StorageCommon {

  constructor() {
    super();
  }

  _setItem(key, data) {
    return localStorage.setItem(key, data);
  }

  _getItem(key) {
    return localStorage.getItem(key);
  }

  _removeItem(key) {
    return localStorage.removeItem(key);
  }

  btoa(str) {
    return btoa(str);
  }
}
