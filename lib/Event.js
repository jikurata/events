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
    Object.defineProperty(this, 'state', {
      value: {
        'PREVIOUS_ARGS': [],
        'EMITTED_ONCE': false,
        'MAX_POOL_SIZE': (param.hasOwnProperty('limit')) ? param.limit : null,
        'PERSISTED': (param.hasOwnProperty('persist')) ? param.persist : false,
        'SUBSCRIBED': (param.hasOwnProperty('subscribe')) ? param.subscribe : true
      },
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  runListeners(...args) {
    if ( !this.isSubscribed ) return;
    this.state.EMITTED_ONCE = true;

    const temp = [];
    this.state.PREVIOUS_ARGS = args || [];
    
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
    if ( !f || typeof f !== 'function') {
      throw new Error(`Event ${this.name} expected an argument of type function`);
    }
    else if (this.maxListenerCount > 0 && this.listeners.length >= this.maxListenerCount) {
      throw new Error(`Could not register listener. Event ${this.name} listener pool exceeds its maximum size of ${this.maxListenerCount}`);
    }

    const isOnce = (options.isOnce) ? options.isOnce : (options.once) ? options.once : false;
    const id = (options.hasOwnProperty('id')) ? options.id : `${this.listeners.length}-${Date.now()}`;
    const listener = new EventListener(id, f, isOnce);
    if ( options.priority === 'first' ) this.listeners.unshift(listener);
    else this.listeners.push(listener);
    // Run the listener with the previous event state when persisting
    if ( this.isPersisted && this.isSubscribed && this.hasEmittedAtLeastOnce ) listener.run(...this.state.PREVIOUS_ARGS);
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

  get maxListenerCount() {
    return this.state.MAX_POOL_SIZE;
  }

  set setMaxListenerCount(val) {
    if ( typeof val === 'number' && val >= 0 ) {
      this.state.MAX_POOL_SIZE = val;
    };
  }

  get hasEmittedAtLeastOnce() {
    return this.state.EMITTED_ONCE;
  }

  get isSubscribed() {
    return this.state.SUBSCRIBED;
  }

  set isSubscribed(bool) {
    this.state.SUBSCRIBED = !!bool;
  }

  get isPersisted() {
    return this.state.PERSISTED;
  }

  set isPersisted(bool) {
    this.state.PERSISTED = !!bool;
  }
}

module.exports = Event;
