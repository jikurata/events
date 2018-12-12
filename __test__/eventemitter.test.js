'use strict';
const EventEmitter = require('../index.js');

describe('Registers an Event object', () => {
  test('Registers an event named "test" in the events map', () => {
    const emitter = new EventEmitter();
    emitter.register('test');
    expect(Object.keys(emitter.events)).toContain('test');
    expect(emitter.events['test'].constructor.name).toBe('Event');
  });
  test('Does not register an event if eventName is blank', () => {
    const emitter = new EventEmitter();
    emitter.register();
    expect(Object.keys(emitter.events).length).toBe(0);
  });
  test('Does not register an event if eventName is null', () => {
    const emitter = new EventEmitter();
    emitter.register(null);
    expect(Object.keys(emitter.events).length).toBe(0);
  });
  test('Does not register an event if eventName is " "', () => {
    const emitter = new EventEmitter();
    emitter.register(' ');
    expect(Object.keys(emitter.events).length).toBe(0);
  });
  test('Does not register an event if eventName is a Number', () => {
    const emitter = new EventEmitter();
    emitter.register(42);
    expect(Object.keys(emitter.events).length).toBe(0);
  });
});
describe('Emitting an event with parameters will pass those parameters to the handler' ,() => {
  test('Sets val to "bar" when foo is passed as a parameter', () => {
    const emitter = new EventEmitter();
    const foo = 'bar';
    emitter.on('test', (value) => {
      let val = null;
      val = value;
      expect(val).toBe('bar');
    });
    emitter.dispatchEvent('test', foo);
  });
  test('Sets val1 to "foo" and val2 to "bar" when passed as separate arguments', () => {
    const emitter = new EventEmitter();
    const foo = 'foo';
    const bar = 'bar';
    emitter.on('test', (value1, value2) => {
      let val1 = null;
      let val2 = null;
      val1 = value1;
      val2 = value2;
      expect([val1, val2]).toEqual([foo, bar]);
    });
    emitter.dispatchEvent('test', foo, bar);
  });
  test('Sets val to [1,2,3]', () => {
    const emitter = new EventEmitter();
    const foo = [1,2,3];
    emitter.on('test', (value) => {
      let val = null;
      val = value;
      expect(val).toEqual(foo);
    });
    emitter.dispatchEvent('test', foo);
  })
});
