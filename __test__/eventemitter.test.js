'use strict';
const EventEmitter = require('../EventEmitter.js');

describe('Registers an Event object', () => {
  test('Registers an event named "test" in the events map', () => {
    const emitter = new EventEmitter();
    emitter.register('test');
    expect(Object.keys(emitter.events)).toContain('test');
    expect(emitter.events['test'].constructor.name).toBe('Event');
  });
  test('Throws error if eventName is blank', () => {
    const emitter = new EventEmitter();
    expect(emitter.register()).toThrow();
  });
  test('Throws error if eventName is null', () => {
    const emitter = new EventEmitter();
    expect(emitter.register(null)).toThrow();
  });
  test('Throws error if eventName is " "', () => {
    const emitter = new EventEmitter();
    expect(emitter.register(" ")).toThrow();
  });
  test('Throws error if eventName is 42', () => {
    const emitter = new EventEmitter();
    expect(emitter.register(42)).toThrow();
  });
});
