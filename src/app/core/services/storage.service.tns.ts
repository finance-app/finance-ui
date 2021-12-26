import { Injectable } from '@angular/core';
import { ApplicationSettings } from '@nativescript/core';
import { Buffer } from 'buffer';

import { StorageCommon } from './storage.common';

@Injectable()
export class StorageService extends StorageCommon {

  constructor() {
    super();
  }

  _setItem(key, data) {
    return ApplicationSettings.setString(key, data);
  }

  _getItem(key) {
    return ApplicationSettings.getString(key);
  }

  _removeItem(key) {
    return ApplicationSettings.remove(key);
  }

  btoa(str) {
    return new Buffer(str, 'binary').toString('base64');
  }
}
