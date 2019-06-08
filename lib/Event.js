'use strict';
const EventListener = require('./EventListener.js');

class Event {
  constructor(name, param = {}) {
    Object.defineProperty(this, 'name', {
      value: name,
      enumerable: true,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'listeners', {
      value: [],
      enumerable: true,
      writable: false,
      configurable: false
    });
    this._PREVIOUS_ARGS = [];
    this._MAX_POOL_SIZE = (param.hasOwnProperty('limit')) ? param.limit : null;
    this._IS_PERSISTED = (param.hasOwnProperty('persist')) ? param.persist : false;
    this._IS_SUBSCRIBED = (param.hasOwnProperty('subscribe')) ? param.subscribe : true;
  }

  runListeners(...args) {
    if ( !this.isSubscribed ) return;
    const temp = [];
    this._PREVIOUS_ARGS = args || [];
    
    for ( let i = 0; i < this.listeners.length; ++i ) {
      const listener = this.listeners[i];
      if ( listener instanceof EventListener ) {
        listener.run(...args);
        if ( !listener.isDeleted ) temp.push(listener);
      }
    }
    
    this.listeners.length = 0;
    temp.forEach(listener => this.listeners.push(listener));
  }

  /**
   * Creates an instance of EventListener for passed listener
   * Returns a generated id for the listener
   * @param {function} f 
   * @param {EventListenerOptions} options
   *  EventListenerOptions properties:
   *    'id': {String} Sets the specified id to the listener
   *    'isOnce' || 'once': {Boolean} Sets the listener to activate only once
   *    'priority': {String} 'first' || 'last': Determine whether to add the listener
   *                to the front or end of the queue
   */
  registerListener(f, options = {isOnce: false}) {
    if ( !f || typeof f !== 'function' ||
      (this.maxListenerCount && this.listeners.length >= this.maxListenerCount) ) {
        return null;
    }
    const isOnce = (options.isOnce) ? options.isOnce : (options.once) ? options.once : false;
    const id = (options.hasOwnProperty('id')) ? options.id : `${this.listeners.length}-${Date.now()}`;
    const listener = new EventListener(id, f, isOnce);
    if ( options.priority === 'first' ) this.listeners.unshift(listener);
    else this.listeners.push(listener);
    // Run the listener with the previous event state when persisting
    if ( this.isPersisted && this.isSubscribed ) listener.run(...this._PREVIOUS_ARGS);
    return id;
  }

  /**
   * Removes the listener with the corresponding id
   * @param {String} id 
   */
  removeListener(id) {
    let index = -1;
    for ( let i = 0; i < this.listeners.length; ++i ) {
      if ( id === this.listeners[i].id ) {
        index = i;
        break;
      };
    }
    if ( index !== -1 ) return this.listeners.splice(index, 1)[0];
    return undefined;
  }

  limit(val) {
    if ( typeof val === 'number' && val >= 0 ) {
      this._MAX_POOL_SIZE = val;
    }
  }

  get maxListenerCount() {
    return this._MAX_POOL_SIZE;
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
