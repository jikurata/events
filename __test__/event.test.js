'use strict';
const Event = require('../lib/Event.js');
const EventHandler = require('../lib/EventHandler.js');

describe('Event unit tests', () => {
  describe('Registers a function handler in the event object', () => {
    test('Registers handler when its type is function', () => {
      const event = new Event('foo');
      const handler = () => {
        return true;
      };
      event.registerHandler(handler);
      expect(event.handlers.length).toBe(1);
    });
    test('Return null if handler arg is empty', () => {
      const event = new Event('foo');
      expect(event.registerHandler()).toBe(null);
    });
    test('Return null if handler is 42', () => {
      const event = new Event('foo');
      expect(event.registerHandler(42)).toBe(null);
    });
    test('Return null if handler is " "', () => {
      const event = new Event('foo');
      expect(event.registerHandler(' ')).toBe(null);
    });
    test('Return null if handler is null', () => {
      const event = new Event('foo');
      expect(event.registerHandler(null)).toBe(null);
    });
  });
  describe('Setting priority = first will push the handler to the front of the queue', () => {
    test('Expect handler with id = bar to be the first handler in the queue', () => {
      const event = new Event('foo');
      event.registerHandler(() => {});
      event.registerHandler(() => {}, {id: 'bar', priority: 'first'});
      expect(event.handlers[0].id).toEqual('bar');
    });
  });
  describe('Removes an existing event handler from the event object', () => {
    test('Removes handler with id = bar from the event object', () => {
      const event = new Event('foo');
      const handler = () => {};
      event.registerHandler(handler, {id: 'bar'});
      const removedHandler = event.removeHandler('bar');
      expect(removedHandler instanceof EventHandler).toBe(true);
    });
  });
  describe('Runs all registered handlers when runHandlers is called', () => {
    test('Expects val to be false and bar to be 42', () => {
      const event = new Event('foo');
      let val = true;
      let bar = 0;
      event.registerHandler(() => val = false);
      event.registerHandler(() => bar = 42);
      event.runHandlers();
      expect([val, bar]).toEqual([false, 42]);
    });
  });
});
