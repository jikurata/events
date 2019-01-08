'use strict';
const Event = require('./lib/Event.js');
const EventHandler = require('./lib/EventHandler.js');
const EventEmitter = require('./lib/EventEmitter.js');

module.exports = EventEmitter;
module.exports.Event = Event;
module.exports.EventHandler = EventHandler;
