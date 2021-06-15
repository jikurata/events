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
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'state', {
      value: {
        'IS_ONCE': isOnce,
        'IS_DELETED': false
      },
      enumerable: false,
      writable: false,
      configurable: false
    });
  }

  /**
   * Executes the handler as a function and passes any arguments into
   * the handler
   * @param  {...Any} args
   */
  run(...args) {
    if ( this.isDeleted ) {
      return;
    };
    // Toggle handler for deletion after being executed when set to occur once
    if ( this.isOnce ) {
      this.state.IS_DELETED = true;
    }
    this.handler(...args);
  }

  get isOnce() {
    return this.state.IS_ONCE;
  }
  get isDeleted() {
    return this.state.IS_DELETED;
  }
}

module.exports = EventListener;
