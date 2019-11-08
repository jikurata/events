'use strict';
const EventError = require('./EventError.js');
const Event = require('./Event.js');

class EventEmitter {
  constructor() {
    Object.defineProperty(this, '_events', {
      value: {},
      enumerable: true,
      writable: false,
      configurable: false
    });

    this.registerEvent('error');
  }

  /**
   * Register a new event for the emitter to watch
   * @param {String} eventName 
   * @param {EventOptions} eventName
   *  EventOptions properties:
   *    'persist': {Boolean} Immediately emit its most recent state to any newly added listeners
   *      Default: false
   *    'limit': {Number} Limits the pool size for listeners
   *      Default: 0 (No limit)
   */
  registerEvent(eventName, options = {}) {
    if ( this.hasEvent(eventName) ) return;
    const event = new Event(eventName, options);
    this._events[eventName] = event;
  }

  /**
   * Removes the event object with the specified event name
   * @param {String} eventName 
   */
  unregisterEvent(eventName) {
    if ( !this.hasEvent(eventName) ) return;
    delete this._events[eventName];
  }

  /**
   * Register an event listener on an event
   * Returns a generated id for the listener
   * @param {String} eventName 
   * @param {Function} listener 
   * @param {EventListenerOptions} options
   *  EventListenerOptions properties:
   *    'id': {String} Sets the specified id to the listener
   *    'once': {Boolean} Sets the listener to activate only once
   *    'priority': {String} 'first' || 'last': Determine whether to add the listener
   *                to the front or end of the queue (Default: 'last')
   */
  addEventListener(eventName, listener, options = {once: false, priority: 'last'}) {
    const isOnce = (options.hasOwnProperty('once')) ? options.once : false;
    const priority = (options.hasOwnProperty('priority')) ? options.priority : 'last';
    const id = (options.hasOwnProperty('id')) ? options.id : undefined;
    if ( !this.hasEvent(eventName) ) this.registerEvent(eventName);
    try {
      this.getEvent(eventName).registerListener(listener, {once: isOnce, priority: priority, id: id});
    }
    catch (err) {
      this.emit('error', err);
    }
  }

  /**
   * Wrapper for addEventListener
   * @param {String} eventName 
   * @param {Function} listener 
   * @param {EventListenerOption} options
   */
  on(eventName, listener, options = {}) {
    return this.addEventListener(eventName, listener, options);
  }

  /**
   * Wrapper for addEventListener with once option enabled
   * @param {String} eventName 
   * @param {Function} listener 
   */
  once(eventName, listener) {
    return this.addEventListener(eventName, listener, {once: true});
  }

  /**
   * Trigger an event and its listeners
   * @param {String} eventName 
   * @param {...Any} args
   * @returns {Promise<Void>}
   */
  dispatchEvent(eventName, ...args) {
    return new Promise((resolve, reject) => {
      const event = this.getEvent(eventName);

      if ( event ) {
        event.runListeners(...args)
        .then(errors => {
          for ( let i = 0; i < errors.length; ++i ) {
            // Emit any errors that the listeners threw
            if ( errors[i] ) {
              this.emit('error', errors[i]);
            }
          }
          return resolve();
        })
        .catch(err => reject(err)); // Throw any unexpected errors
      }
      else {
        // Register the event if it does not exist
        this.registerEvent(eventName);
        return resolve();
      }
    })
  }

  /**
   * Wrapper for dispatchEvent
   * @param {String} eventName 
   * @param {...Any} args
   */
  emit(eventName, ...args) {
    return this.dispatchEvent(eventName, ...args);
  }

  /**
   * Removes listener with corresponding id
   * Returns the deleted listener
   * @param {String} eventName 
   * @param {String} id 
   */
  removeEventListener(eventName, id) {
    if ( !this.hasEvent(eventName) ) return;
    return this.getEvent(eventName).removeListener(id);
  }

  hasEvent(eventName) {
    return this._events.hasOwnProperty(eventName);
  }

  getEvent(name) {
    return this._events[name];
  }
}

module.exports = EventEmitter;
