'use strict';
const EventError = require('./EventError.js');

class EventListener {
  constructor(id, handler, isOnce = false) {
    // Throw if handler is not a function
    EventError.InvalidListener.throwCheck(handler);

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

  /**
   * Executes the handler as a function and passes any arguments into
   * the handler
   * @param  {...any} args
   * @returns {Promise<Void>}
   */
  run(...args) {
    return new Promise((resolve, reject) => {
      if ( this.isDeleted ) {
        return resolve();
      };
      
      // Toggle handler for deletion after being executed when set to occur once
      if ( this.isOnce ) {
        this._IS_DELETED = true;
      }

      // Pass any arguments into the handler function
      const returnValue = this.handler(...args);
      if ( returnValue instanceof Promise ) {
        // If the handler returns a Promise, wait for it to complete
        returnValue
        .then(() => resolve())
        .catch(err => reject(err));
      }
      else {
        return resolve();
      }
    });
  }

  get isOnce() {
    return this._IS_ONCE;
  }
  get isDeleted() {
    return this._IS_DELETED;
  }
}

module.exports = EventListener;
