'use strict';
const uuid = require('uuid/v1');
const EventHandler = require('./EventHandler.js');

class Event {
  constructor(name) {
    this._name = name;
    this._handlers = {};
  }

  runHandlers(...args) {
    for ( let id of Object.keys(this.handlers) ) {
      this.handlers[id].run(...args);
      if ( this.handlers[id].isOnce ) this.removeHandler(id);
    }
  }

  /**
   * returns a generated id for the handler
   * @param {function} handler 
   */
  registerHandler(handler, isOnce = false) {
    if ( typeof handler !== 'function' ) return null;
    const id = uuid();
    this.handlers[id] = new EventHandler(id, handler, isOnce);
    return id;
  }

  /**
   * returns the deleted handler
   * @param {String} id 
   */
  removeHandler(id) {
    if ( !this.handlers.hasOwnProperty(id) ) return;
    const handler = this.handlers[id];
    delete this.handlers[id];
    return handler;
  }

  get name() {
    return this._name;
  }

  get handlers() {
    return this._handlers;
  }
}

module.exports = Event;
