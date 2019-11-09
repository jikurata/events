'use strict';
const Taste = require('@jikurata/taste');
const EventEmitter = require('../src/EventEmitter.js');

const test = new Promise((resolve, reject) => {
  Taste.flavor('Register Events')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.registerEvent('foo');
    profile.hasEvent = emitter.hasEvent('foo');
  })
  .expect('hasEvent').toBeTruthy();

  Taste.flavor('Unregister an event from EventEmitter')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.registerEvent('foo');
    emitter.unregisterEvent('foo');
    profile.hasEvent = emitter.hasEvent('foo');
  })
  .expect('hasEvent').toBeFalsy();
  
  Taste.flavor('Emitting arguments with an event')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.on('test1', (value) => {
      profile.foo = value;
    });
    emitter.on('test2', (v1, v2) => {
      profile.bar = v1;
      profile.baz = v2;
    });
    emitter.dispatchEvent('test1', 'foo');
    emitter.dispatchEvent('test2', 'bar', 'baz');
  })
  .expect('foo').toEqual('foo')
  .expect('bar').toEqual('bar')
  .expect('baz').toEqual('baz');

  Taste.flavor('Emitting an event resolves when all listeners finish')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.on('foo', () => {});
    emitter.on('foo', () => {
      setTimeout(() => {}, 500);
    });
    emitter.emit('foo')
    .then(() => {
      profile.promiseResolved = true;
    })
  })
  .expect('promiseResolved').toBeTruthy();

  Taste.flavor('Thrown errors from listeners are emitted to the error event')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.on('foo', () => {
      throw new Error('error 1');
    });
    emitter.on('foo', () => {
      throw new Error('error 2');
    });

    emitter.emit('foo')
    .then(errors => {
      profile.errorCount = errors.length;
    })
  })
  .expect('errorCount').toEqual(2);

  resolve();
});

module.exports = test;
