(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
const EventHandler = require('./EventHandler.js');

class Event {
  constructor(name) {
    this._name = name;
    this._handlers = {};
  }

  runHandlers(...args) {
    for ( let id of Object.keys(this.handlers) ) {
      this.handlers[id].run(...args);
      if ( this.handlers[id].isOnce ) this.removeHandler(id);
    }
  }

  /**
   * Creates an instance of EventHandler for passed handler
   * Returns a generated id for the handler
   * @param {function} handler 
   * @param {boolean} isOnce
   */
  registerHandler(handler, isOnce = false) {
    if ( typeof handler !== 'function' ) return null;
    const id = `${this.name}-${Date.now()}`;
    this.handlers[id] = new EventHandler(id, handler, isOnce);
    return id;
  }

  /**
   * Removes the handler with the corresponding id
   * Returns the deleted handler
   * @param {String} id 
   */
  removeHandler(id) {
    if ( !this.handlers.hasOwnProperty(id) ) return;
    const handler = this.handlers[id].handler;
    delete this.handlers[id];
    return handler;
  }

  get name() {
    return this._name;
  }

  get handlers() {
    return this._handlers;
  }
}

module.exports = Event;

},{"./EventHandler.js":3}],2:[function(require,module,exports){
'use strict';
const Event = require('./Event.js');
const EventHandler = require('./EventHandler.js');

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

  get events() {
    return this._events;
  }
}

module.exports = EventEmitter;

},{"./Event.js":1,"./EventHandler.js":3}],3:[function(require,module,exports){
'use strict';

class EventHandler {
  constructor(id, handler, isOnce = false) {
    this._id = id
    this._handler = handler;
    this._isOnce = isOnce;
  }

  run(...args) {
    return this.handler(...args);
  }

  get id() {
    return this._id;
  }

  get handler() {
    return this._handler;
  }

  get isOnce() {
    return this._isOnce;
  }
}

module.exports = EventHandler;

},{}],4:[function(require,module,exports){
const EventEmitter = require('./EventEmitter.js');

module.exports = EventEmitter;
module.exports.Event = Event;
module.exports.EventHandler = EventHandler;

},{"./EventEmitter.js":2}]},{},[4]);
