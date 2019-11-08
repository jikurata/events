'use strict';
const Taste = require('@jikurata/taste');
const EventEmitter = require('../src/EventEmitter.js');
const Event = require('../src/Event.js');
const EventError = require('../src/EventError.js');

const test = new Promise((resolve, reject) => {
  Taste.flavor('Throwing InvalidListener')
  .test(profile => {
    const event = new Event('foo');
    try {
      event.registerListener();
    }
    catch(err) {
      profile.argIsEmpty = err;
    }
    try {
      event.registerListener(42);
    }
    catch(err) {
      profile.argIsNumber = err;
    }
    try {
      event.registerListener(' ');
    }
    catch(err) {
      profile.argIsString = err;
    }
    try {
      event.registerListener(null);
    }
    catch(err) {
      profile.argIsNull = err;
    }
    resolve();
  })
  .expect('argIsEmpty').isInstanceOf(EventError.InvalidListener)
  .expect('argIsNumber').isInstanceOf(EventError.InvalidListener)
  .expect('argIsString').isInstanceOf(EventError.InvalidListener)
  .expect('argIsNull').isInstanceOf(EventError.InvalidListener);
  
  Taste.flavor('Throw InvalidEventName')
  .test(profile => {
    const emitter = new EventEmitter();
    try {
      emitter.register();
    }
    catch(err) {}
    try {
      emitter.register(null);
    }
    catch(err) {}
    try {
      emitter.register(undefined);
    }
    catch(err) {}
    try {
      emitter.register(true);
    }
    catch(err) {}
    try {
      emitter.register((val) => val);
    }
    catch(err) {}
    try {
      emitter.register([1,2,3]);
    }
    catch(err) {}
    try {
      emitter.register({'foo': 'bar'});
    }
    catch(err) {}
    try {
      emitter.register('');
    }
    catch(err) {}
    try {
      emitter.register(' ');
    }
    catch(err) {}
    try {
      emitter.register(42);
    }
    catch(err) {}
    try {
      emitter.register(-1);
    }
    catch(err) {}
    try {
      emitter.on(undefined, () => {});
    }
    catch(err) {}
    profile.eventCount = Object.keys(emitter._events).filter(e => e.name === 'error').length;
  })
  .expect('eventCount').toEqual(0);
});

module.exports = test;
