import { Injectable } from '@angular/core';
import { getString, setString, remove } from 'tns-core-modules/application-settings';
import { Buffer } from 'buffer';

import { StorageCommon } from './storage.common';

@Injectable()
export class StorageService extends StorageCommon {

  constructor() {
    super();
  }

  _setItem(key, data) {
    return setString(key, data);
  }

  _getItem(key) {
    return getString(key);
  }

  _removeItem(key) {
    return remove(key);
  }

  btoa(str) {
    return new Buffer(str, 'binary').toString('base64');
  }
}
