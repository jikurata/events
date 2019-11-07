'use strict';
const EventError = require('./EventError.js');
const Event = require('./Event.js');

class EventEmitter {
  constructor() {
    Object.defineProperty(this, 'events', {
      value: {},
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  /**
   * Register a new event for the emitter to watch
   * @param {String} eventName 
   * @param {EventOptions} eventName
   *  EventOptions properties:
   *    'persist': {Boolean} Immediately emit its most recent state to any newly added listeners
   *      Default: false
   *    'subscribe': {Boolean} Event will execute its listeners
   *      Default: true
   *    'limit': {Number} Limits the pool size for listeners
   *      Default: null (No limit)
   */
  registerEvent(eventName, options = {}) {
    if ( this.hasEvent(eventName) ) return;
    
    const event = new Event(eventName, options);
    this.events[eventName] = event;
  }

  /**
   * Removes the event object with the specified event name
   * @param {String} eventName 
   */
  unregisterEvent(eventName) {
    if ( !this.hasEvent(eventName) ) return;
    delete this.events[eventName];
  }

  /**
   * Register an event listener on an event
   * Returns a generated id for the listener
   * @param {String} eventName 
   * @param {Function} listener 
   * @param {EventListenerOptions} options
   *  EventListenerOptions properties:
   *    'id': {String} Sets the specified id to the listener
   *    'isOnce': {Boolean} Sets the listener to activate only once
   *    'priority': {String} 'first' || 'last': Determine whether to add the listener
   *                to the front or end of the queue
   */
  addEventListener(eventName, listener, options = {once: false, priority: 'last'}) {
    const isOnce = (options.hasOwnProperty('once')) ? options.once : false;
    const priority = (options.hasOwnProperty('priority')) ? options.priority : 'last';
    const id = (options.hasOwnProperty('id')) ? options.id : undefined;
    if ( !this.hasEvent(eventName) ) this.registerEvent(eventName);
    if ( !this.isValidName(eventName) ) return;
    return this.events[eventName].registerListener(listener, {once: isOnce, priority: priority, id: id});
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
   * Trigger an event
   * @param {String} eventName 
   */
  dispatchEvent(eventName, ...args) {
    if ( !this.hasEvent(eventName) ) this.registerEvent(eventName);
    if ( this.isEventsEnabled ) {
      const event = this.events[eventName];
      event.runListeners(...args);
    }
  }

  /**
   * Wrapper for dispatchEvent
   * @param {String} eventName 
   */
  emit(eventName, ...args) {
    this.dispatchEvent(eventName, ...args);
  }

  /**
   * Removes listener with corresponding id
   * Returns the deleted listener
   * @param {String} eventName 
   * @param {String} id 
   */
  removeEventListener(eventName, id) {
    if ( !this.hasEvent(eventName) ) return;
    return this.events[eventName].removeHandler(id);
  }

  hasEvent(eventName) {
    return this.events.hasOwnProperty(eventName);
  }

  isValidName(eventName) {
    try {
      EventError.InvalidEventName.throwCheck(eventName);
      return true;
    }
    catch(err) { return false; }
  }

  getEvent(name) {
    return this.events[name];
  }
}

module.exports = EventEmitter;
