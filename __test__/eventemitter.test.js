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
