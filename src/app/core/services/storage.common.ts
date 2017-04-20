import { Injectable } from '@angular/core';

@Injectable()
export abstract class StorageCommon {

  constructor() {}

  abstract _setItem(key, data);
  abstract _getItem(key);
  abstract _removeItem(key);
  abstract btoa(str);

  setItem(key, data) {
    return this._setItem(this.userKey(key), typeof data === 'string' ? data : JSON.stringify(data));
  }

  getItem(key) {
    const data = this._getItem(this.userKey(key));
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  getGlobalItem(key) {
    const data = this._getItem(key);
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  setGlobalItem(key, data) {
    return this._setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  }

  removeGlobalItem(key) {
    return this._removeItem(key);
  }

  removeItem(key) {
    return this._removeItem(this.userKey(key));
  }

  userKey(key) {
    return this.btoa(this._getItem('current_user') + key);
  }

  userClear() {
    console.error('Clearing user storage not implemented!');
  }
}
