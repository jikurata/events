'use strict';
const Event = require('../lib/Event.js');
const EventHandler = require('../lib/EventHandler.js');

describe('Registers a function handler in the event object', () => {
  test('Registers handler when its type is function', () => {
    const event = new Event('test');
    const handler = () => {
      return true;
    };
    event.registerHandler(handler);
    expect(event.handlers.length).toBe(1);
  });
  test('Return null if handler arg is empty', () => {
    const event = new Event('test');
    expect(event.registerHandler()).toBe(null);
  });
  test('Return null if handler is 42', () => {
    const event = new Event('test');
    expect(event.registerHandler(42)).toBe(null);
  });
  test('Return null if handler is " "', () => {
    const event = new Event('test');
    expect(event.registerHandler(' ')).toBe(null);
  });
  test('Return null if handler is null', () => {
    const event = new Event('test');
    expect(event.registerHandler(null)).toBe(null);
  });
});
describe('Removes an existing event handler from the event object', () => {
  test('Removes handler from the event object', () => {
    const event = new Event('test');
    const handler = () => {
      return true;
    };
    event.registerHandler(handler, {id: 'foo'});
    const removedHandler = event.removeHandler('foo');
    expect(removedHandler instanceof EventHandler).toBeTruthy();
  });
});
describe('Runs all registered handlers when event is emitted', () => {
  test('Emitting "test" expects val to be true and foo to be 42', () => {
    const val = true;
    const foo = 42;
    const event = new Event('test');
    event.registerHandler(() => {
      expect(val).toBe(true);
    });
    event.registerHandler(() => {
      expect(foo).toBe(42);
    })
    event.runHandlers();
  });
})
