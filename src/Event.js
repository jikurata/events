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
      value: [],
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
   * Any errors thrown by a listener are safely caught and resolved 
   * @param {Array<EventListener>} listeners 
   * @param  {...any} args 
   * @returns {Promise<Array<Error>>}
   */
  run(listeners, ...args) {
    // Update event state
    this.state.EMITTED_ONCE = true;
    this.state.PREVIOUS_ARGS = args || [];
    
    const promises = [];
    // Execute each listener on the event
    for ( let i = 0; i < listeners.length; ++i ) {
      const promise = new Promise((resolveListener, rejectListener) => {
        listeners[i].run(...args)
        .then(() => resolveListener())
        .catch(err => resolveListener(err));
      });
      promises.push(promise);
    }

    return Promise.all(promises)
    .then(errors => {
      // Check for any listeners set to be deleted once resolved
      this.removeListener();
      return errors;
    });
  }

  /**
   * Wrapper for event's run method
   * Executes all listeners on the event
   * @param {...any} args
   * @returns {Promise<Array<Error>>}
   */
  runListeners(...args) {
    const listeners = [].concat(this.listeners);
    return this.run(listeners, ...args);
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
  registerListener(f, options = {once: false}) {
    // Throw if invalidated
    EventError.ExceedsMaxListeners.throwCheck(this);

    const isOnce = (options.once) ? options.once : false;
    const id = (options.hasOwnProperty('id')) ? options.id : `${this.listeners.length}-${Date.now()}`;
    const listener = new EventListener(id, f, isOnce);

    if ( options.priority === 'first' ) this.listeners.unshift(listener);
    else this.listeners.push(listener);
    // Run the listener with the previous event state when persisting
    if ( this.isPersisted && this.hasEmittedAtLeastOnce ) {
      this.run([listener], ...this.state.PREVIOUS_ARGS);
    }
    return id;
  }

  /**
   * Removes listeners with a matching id
   * When the argument is undefined, it will search for listeners set to be deleted still
   * @param {String|Array<String>} id 
   */
  removeListener(id) {
    if ( !Array.isArray(id) ) {
      id = [id];
    }

    const temp = [];
    const listeners = [].concat(this.listeners);
    for (let i = 0; i < listeners.length; ++i ) {
      const listener = listeners[i];
      if ( !listener.isDeleted && id.indexOf(listener.id) === -1 ) {
        temp.push(listener);
      }
    }
    // Replace the current set of listeners with the new set
    if ( temp.length !== listeners.length ) {
      this.listeners.length = 0;
      for ( let i = 0; i < temp.length; ++i ) {
        this.listeners.push(temp[i]);
      }
    }
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
