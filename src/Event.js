'use strict';
const EventListener = require('./EventListener.js');
const EventError = require('./EventError.js');

class Event {
  constructor(name, param = {}) {
    EventError.InvalidEventName.throwCheck(name);
    Object.defineProperty(this, 'name', {
      value: name,
      enumerable: true,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'listeners', {
      value: {},
      enumerable: true,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'state', {
      value: {
        'PREVIOUS_ARGS': [],
        'EMITTED_ONCE': false,
        'MAX_POOL_SIZE': (param.hasOwnProperty('limit')) ? param.limit : 0,
        'PERSISTED': (param.hasOwnProperty('persist')) ? param.persist : false
      },
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  /**
   * Runs the listeners provided as an argument
   * @param {Array<EventListener>} listeners 
   * @param  {...Any} args 
   */
  handle(...args) {
    // Update event state
    this.state.EMITTED_ONCE = true;
    this.state.PREVIOUS_ARGS = args || [];
    const listeners = Object.values(this.listeners);
    // Execute each listener on the event
    for ( let i = 0; i < listeners.length; ++i ) {
      const fn = listeners[i];
      if ( fn.isDeleted ) {
        this.removeListener(fn.id);
      }
      else {
        fn.run(...args);
      }
    }
  }

  /**
   * Creates an instance of EventListener for passed listener
   * Returns a generated id for the listener
   * @param {function} fn
   * @param {EventListenerOptions} options
   *  EventListenerOptions properties:
   *    'id': {String} Sets the specified id to the listener
   *    'isOnce' || 'once': {Boolean} Sets the listener to activate only once
   * @returns {String}
   */
  registerListener(fn, options = {once: false}) {
    // Throw if invalidated
    EventError.ExceedsMaxListeners.throwCheck(this);

    const isOnce = (options.hasOwnProperty('once')) ? options.once : false;
    const id = (options.hasOwnProperty('id') && options.id) ? options.id : `${Object.keys(this.listeners).length}-${Date.now()}`;
    const listener = new EventListener(id, fn, isOnce);

    this.listeners[id] = listener;

    // Run the listener with the previous event state when persisting
    if ( this.isPersisted && this.hasEmittedAtLeastOnce ) {
      listener.run(...this.state.PREVIOUS_ARGS);
    }
    return id;
  }

  /**
   * Removes listeners with a matching id
   * When the argument is undefined, it will search for listeners set to be deleted still
   * @param {String} id 
   */
  removeListener(id) {
    if ( this.listeners.hasOwnProperty(id)) {
      delete this.listeners[id];
    }
  }

  getListener(id) {
    return this.listeners[id];
  }

  get maxListenerCount() {
    return this.state.MAX_POOL_SIZE;
  }

  set maxListenerCount(val) {
    if ( typeof val === 'number' ) {
      this.state.MAX_POOL_SIZE = val;
    };
  }

  get hasEmittedAtLeastOnce() {
    return this.state.EMITTED_ONCE;
  }

  get isPersisted() {
    return this.state.PERSISTED;
  }

  set isPersisted(bool) {
    this.state.PERSISTED = !!bool;
  }
}

module.exports = Event;
