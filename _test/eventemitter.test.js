'use strict';
const Taste = require('@jikurata/taste');
const EventEmitter = require('../src/EventEmitter.js');

const test = new Promise((resolve, reject) => {
  Taste.flavor('Global EventEmitters')
  .describe('Passing an id to the emitter will make its reference global')
  .test(profile => {
    const emitter = new EventEmitter({id: 'foo'});
    const secondEmitter = EventEmitter.instanceOf('foo');
    emitter.on('bar', () => console.log('foobar'));
    profile.emitterIsGlobal = secondEmitter.events.hasEvent('foo');
  })
  .expect('emitterIsGlobal').toBeTruthy();
  
  Taste.flavor('Local EventEmitters do not interfere with global emitters')
  .test(profile => {
    const globalEmitter = new EventEmitter({id: 'foo'});
    const localEmitter = new EventEmitter();
    globalEmitter.register('foobar');
    profile.notTheSame = localEmitter.hasEvent('foobar');
  })
  .expect('notTheSame').toBeFalsy();

  Taste.flavor('Register Events')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.register('foo');
    profile.hasEvent = emitter.hasEvent('foo');
  })
  .expect('hasEvent').toBeTruthy();
  
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

  Taste.flavor('Unsubscribe from an event')
  .describe('Disables emitting of the event')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.register('foo');
    emitter.unsubscribe('foo');
    profile.isSubscribed = emitter.events['foo'].isSubscribed;
  })
  .expect('isSubscribed').toBeFalsy();

  Taste.flavor('Unregister an event from EventEmitter')
  .test(profile => {
    const emitter = new EventEmitter();
    emitter.register('foo');
    emitter.unregister('foo');
    profile.hasEvent = emitter.hasEvent('foo');
  })
  .expect('hasEvent').toBeFalsy();

  Taste.flavor('Disable an EventEmitter')
  .describe('Does not emit any events when disabled')
  .test(profile => {
    const emitter = new EventEmitter();
    let valueShouldNotChange = 1;
    emitter.on('foo', () => {
      valueShouldNotChange = 0;
    });
    emitter.disable();
    emitter.emit('foo');
    profile.value = valueShouldNotChange;
  })
  .expect('value').toEqual(1);

  resolve();
});

module.exports = test;
