'use strict';
const Event = require('./Event.js');

class EventEmitter {
  constructor() {
    this._events = {};
  }

  /**
   * Register a new event for the emitter to watch
   * @param {String} eventName 
   */
  register(eventName) {
    if ( this.hasEvent(eventName) || !this.isValidName(eventName) ) return;
    this.events[eventName] = new Event(eventName);
  }

  /**
   * Register an event handler on an event
   * Returns a generated id for the listener
   * @param {String} eventName 
   * @param {Function} handler 
   */
  addEventListener(eventName, handler, options = {once: false}) {
    const isOnce = (options.hasOwnProperty('once')) ? options.once : false;
    if ( !this.hasEvent(eventName) ) this.register(eventName);
    return this.events[eventName].registerHandler(handler, isOnce);
  }

  /**
   * Wrapper for addEventListener
   * @param {String} eventName 
   * @param {Function} handler 
   */
  on(eventName, handler) {
    return this.addEventListener(eventName, handler);
  }

  /**
   * Wrapper for addEventListener with once option enabled
   * @param {String} eventName 
   * @param {Function} handler 
   */
  once(eventName, handler) {
    return this.addEventListener(eventName, handler, {once: true});
  }

  /**
   * Trigger an event
   * @param {String} eventName 
   */
  dispatchEvent(eventName, ...args) {
    if ( !this.hasEvent(eventName) ) this.register(eventName);
    this.events[eventName].runHandlers(...args);
  }

  /**
   * Wrapper for dispatchEvent
   * @param {String} eventName 
   */
  emit(eventName, ...args) {
    this.dispatchEvent(eventName, ...args);
  }

  removeEventListener(eventName, id) {
    if ( !this.hasEvent(eventName) ) return;
    this.events[eventName].removeHandler(id);
  }

  hasEvent(eventName) {
    return this.events.hasOwnProperty(eventName);
  }

  isValidName(eventName) {
    return ( typeof eventName === 'string' && eventName.trim() !== '' );
  }

  get events() {
    return this._events;
  }
}

module.exports = EventEmitter;
