'use strict';
const EventHandler = require('./EventHandler.js');

class Event {
  constructor(name, param = {}) {
    Object.defineProperty(this, 'name', {
      value: name,
      enumerable: true,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'handlers', {
      value: [],
      enumerable: true,
      writable: false,
      configurable: false
    });
    this._PREVIOUS_ARGS = [];
    this._IS_PERSISTED = (param.hasOwnProperty('persist')) ? param.persist : false;
    this._IS_SUBSCRIBED = (param.hasOwnProperty('subscribe')) ? param.subscribe : true;
  }

  runHandlers(...args) {
    if ( !this.isSubscribed ) return;
    const temp = [];
    this._PREVIOUS_ARGS = args || [];
    
    for ( let i = 0; i < this.handlers.length; ++i ) {
      const handler = this.handlers[i];
      if ( handler instanceof EventHandler ) {
        handler.run(...args);
        if ( !handler.isDeleted ) temp.push(handler);
      }
    }
    
    this.handlers.length = 0;
    temp.forEach(handler => this.handlers.push(handler));
  }

  /**
   * Creates an instance of EventHandler for passed handler
   * Returns a generated id for the handler
   * @param {function} f 
   * @param {Object} options
   *  properties:
   *    'id': (String) Sets the specified id to the handler
   *    'isOnce': (Boolean) Sets the handler to activate only once
   *    'priority': (String) 'first' || 'last': Determine whether to add the handler
   *                to the front or end of the queue
   */
  registerHandler(f, options = {isOnce: false}) {
    if ( !f || typeof f !== 'function' ) return null;
    const isOnce = (options.hasOwnProperty('isOnce')) ? options.isOnce : false;
    const id = (options.hasOwnProperty('id')) ? options.id : `${this.handlers.length}-${Date.now()}`;
    const handler = new EventHandler(id, f, isOnce);
    if ( options.priority === 'first' ) this.handlers.unshift(handler);
    else this.handlers.push(handler);
    // Run the handler with the previous event state when persisting
    if ( this.isPersisted && this.isSubscribed ) handler.run(...this._PREVIOUS_ARGS);
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

  get isSubscribed() {
    return this._IS_SUBSCRIBED;
  }

  set isSubscribed(bool) {
    this._IS_SUBSCRIBED = (bool);
  }

  get isPersisted() {
    return this._IS_PERSISTED;
  }

  set isPersisted(bool) {
    return this._IS_PERSISTED = (bool);
  }
}

module.exports = Event;
