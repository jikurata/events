'use strict';
const EventHandler = require('./EventHandler.js');

class Event {
  constructor(name) {
    this._name = name;
    this._handlers = [];
    this._isActive = true;
  }

  runHandlers(...args) {
    if ( !this.isActive ) return;
    const temp = [];
    for ( let i = 0; i < this.handlers.length; ++i ) {
      this.handlers[i].run(...args);
      if ( !this.handlers[i].isOnce ) temp.push(this.handlers[i]);
    }
    this._handlers = temp;
  }

  /**
   * Creates an instance of EventHandler for passed handler
   * Returns a generated id for the handler
   * @param {function} handler 
   * @param {Object} options
   *  properties:
   *    'id': (String) Sets the specified id to the handler
   *    'isOnce': (Boolean) Sets the handler to activate only once
   *    'priority': (String) 'first' || 'last': Determine whether to add the handler
   *                to the front or end of the queue
   */
  registerHandler(handler, options = {isOnce: false}) {
    if ( typeof handler !== 'function' ) return null;
    const isOnce = (options.hasOwnProperty('isOnce')) ? options.isOnce : false;
    const id = (options.hasOwnProperty('id')) ? options.id : `${this.name}-${Date.now()}`;
    if ( options.priority === 'first' ) this.handlers.unshift(new EventHandler(id, handler, isOnce));
    else this.handlers.push(new EventHandler(id, handler, isOnce));
    return id;
  }

  /**
   * Removes the handler with the corresponding id
   * @param {String} id 
   */
  removeHandler(id) {
    let index = -1;
    for ( let i = 0; i < this.handlers.length; ++i ) {
      if ( id === this.handlers[i].id ) {
        index = i;
        break;
      };
    }
    if ( index !== -1 ) return this.handlers.splice(index, 1)[0];
    return undefined;
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
