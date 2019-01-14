'use strict';
const EventHandler = require('./EventHandler.js');

class Event {
  constructor(name) {
    this._name = name;
    this._handlers = {};
    this._isActive = true;
  }

  runHandlers(...args) {
    if ( !this.isActive ) return;
    for ( let id of Object.keys(this.handlers) ) {
      this.handlers[id].run(...args);
      if ( this.handlers[id].isOnce ) this.removeHandler(id);
    }
  }

  /**
   * Creates an instance of EventHandler for passed handler
   * Returns a generated id for the handler
   * @param {function} handler 
   * @param {boolean} isOnce
   */
  registerHandler(handler, isOnce = false) {
    if ( typeof handler !== 'function' ) return null;
    const id = `${this.name}-${Date.now()}`;
    this.handlers[id] = new EventHandler(id, handler, isOnce);
    return id;
  }

  /**
   * Removes the handler with the corresponding id
   * Returns the deleted handler
   * @param {String} id 
   */
  removeHandler(id) {
    if ( !this.handlers.hasOwnProperty(id) ) return;
    const handler = this.handlers[id].handler;
    delete this.handlers[id];
    return handler;
  }

  get name() {
    return this._name;
  }

  get handlers() {
    return this._handlers;
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(bool) {
    this._isActive = bool;
  }
}

module.exports = Event;
