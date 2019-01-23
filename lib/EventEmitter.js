'use strict';
const Event = require('./Event.js');
const instances = {};

class EventEmitter {
  constructor(options = {enable: true, id: ''}) {
    this._id = options.id;
    this._events = {};
    this._isEnabled = (options.hasOwnProperty('enable')) ? options.enable : true;
    if ( options.id ) {
      if ( instances.hasOwnProperty(options.id) ) return instances[options.id];
      instances[options.id] = this;
    }
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
   * Removes the event object with the specified event name
   * @param {String} eventName 
   */
  unregister(eventName) {
    if ( !this.hasEvent(eventName) ) return;
    delete this.events[eventName];
  }

  /**
   * Sets Event's isActive property to true
   * Emitting the event will cause the Event's handlers to execute
   * @param {String} eventName 
   */
  subscribe(eventName) {
    if ( !this.hasEvent(eventName) ) this.register(eventName);
    if ( !this.isValidName(eventName) ) return;
    this.events[eventName].isActive = true;
  }

  /**
   * Sets Event's isActive property to false
   * Prevents the Event's handlers from executing
   * If the event does not exist yet, it will create the event
   * and then unsubscribe from it
   * @param {String} eventName 
   */
  unsubscribe(eventName) {
    if ( !this.hasEvent(eventName) ) this.register(eventName);
    if ( !this.isValidName(eventName) ) return;
    this.events[eventName].isActive = false;
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
    if ( !this.isValidName(eventName) ) return;
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
    if ( this.isEnabled ) this.events[eventName].runHandlers(...args);
  }

  /**
   * Wrapper for dispatchEvent
   * @param {String} eventName 
   */
  emit(eventName, ...args) {
    this.dispatchEvent(eventName, ...args);
  }

  /**
   * Removes handler with corresponding id
   * Returns the deleted handler
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
    return ( typeof eventName === 'string' && eventName.trim() !== '' );
  }

  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  static instanceOf(id) {
    if ( !instances.hasOwnProperty(id) ) return null;
    return instances[id];
  }

  get id() {
    return this._id;
  }

  get events() {
    return this._events;
  }

  get isEnabled() {
    return this._isEnabled;
  }
}

module.exports = EventEmitter;
