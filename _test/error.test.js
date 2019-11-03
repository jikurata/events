'use strict';
const Taste = require('@jikurata/taste');
const Event = require('../lib/Event.js');
const EventListener = require('../lib/EventListener.js');
const EventError = require('../src/Error.js');

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
})
.expect('emptyArg').toBeInstanceOf(EventError.InvalidListener)
.expect('argIsNumber').toBeInstanceOf(EventError.InvalidListener)
.expect('argIsString').toBeInstanceOf(EventError.InvalidListener)
.expect('argIsNull').toBeInstanceOf(EventError.InvalidListener);
