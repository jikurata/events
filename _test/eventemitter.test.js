'use strict';
const Taste = require('@jikurata/taste');
const EventEmitter = require('../src/EventEmitter.js');

Taste('Register Events')
.test('', profile => {
  const emitter = new EventEmitter();
  emitter.registerEvent('foo');
  profile.exists = emitter.hasEvent('foo');
})
.expect('exists').toBeTruthy();

Taste('Unregister an event from EventEmitter')
.test(profile => {
  const emitter = new EventEmitter();
  emitter.registerEvent('foo');
  emitter.unregisterEvent('foo');
  profile.exists = emitter.hasEvent('foo');
})
.expect('exists').toBeFalsy();

Taste('Emitting arguments with an event')
.test(profile => {
  const emitter = new EventEmitter();
  emitter.on('test1', (value) => {
    profile.foo = value;
  });
  emitter.on('test2', (v1, v2) => {
    profile.bar = v1;
    profile.baz = v2;
  });
  emitter.emit('test1', 'foo');
  emitter.emit('test2', 'bar', 'baz');
})
.expect('foo').toEqual('foo')
.expect('bar').toEqual('bar')
.expect('baz').toEqual('baz');

Taste('Thrown errors from listeners are emitted to the error event')
.test(profile => {
  const emitter = new EventEmitter();
  let bool = false;
  emitter.on('error', (err) => {
    bool = true;
  });
  emitter.on('foo', () => {
    throw new Error('exception');
  });

  emitter.emit('foo');
  profile.errorEmitted = bool;
})
.expect('errorEmitted').toBeTruthy();

module.exports = Taste;
