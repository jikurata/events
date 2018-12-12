'use strict';

class EventHandler {
  constructor(id, handler, isOnce = false) {
    this._id = id
    this._handler = handler;
    this._isOnce = isOnce;
  }

  run(...args) {
    return this.handler(...args);
  }

  get id() {
    return this._id;
  }

  get handler() {
    return this._handler;
  }

  get isOnce() {
    return this._isOnce;
  }
}

module.exports = EventHandler;
