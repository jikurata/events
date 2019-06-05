'use strict';

class EventListener {
  constructor(id, handler, isOnce = false) {
    Object.defineProperty(this, 'id', {
      value: id,
      enumerable: true,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'handler', {
      value: handler,
      enumerable: true,
      writable: false,
      configurable: false
    });
    this._IS_ONCE = isOnce;
    this._IS_DELETED = false;
  }

  run(...args) {
    if ( this.isDeleted ) return;
    // Toggle handler for deletion after being executed when set to occur once
    if ( this.isOnce ) this._IS_DELETED = true;
    if ( typeof this.handler === 'function' ) this.handler(...args);
    else this._IS_DELETED = true;
  }

  get isOnce() {
    return this._IS_ONCE;
  }
  get isDeleted() {
    return this._IS_DELETED;
  }
}

module.exports = EventListener;
