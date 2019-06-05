'use strict';
const Event = require('../lib/Event.js');
const EventListener = require('../lib/EventListener.js');

describe('Event unit tests', () => {
  describe('Registers a function listener in the event object', () => {
    test('Registers listener when its type is function', () => {
      const event = new Event('foo');
      const listener = () => {
        return true;
      };
      event.registerListener(listener);
      expect(event.listeners.length).toBe(1);
    });
    test('Return null if listener arg is empty', () => {
      const event = new Event('foo');
      expect(event.registerListener()).toBe(null);
    });
    test('Return null if listener is 42', () => {
      const event = new Event('foo');
      expect(event.registerListener(42)).toBe(null);
    });
    test('Return null if listener is " "', () => {
      const event = new Event('foo');
      expect(event.registerListener(' ')).toBe(null);
    });
    test('Return null if listener is null', () => {
      const event = new Event('foo');
      expect(event.registerListener(null)).toBe(null);
    });
  });
  describe('Setting priority = first will push the listener to the front of the queue', () => {
    test('Expect listener with id = bar to be the first listener in the queue', () => {
      const event = new Event('foo');
      event.registerListener(() => {});
      event.registerListener(() => {}, {id: 'bar', priority: 'first'});
      expect(event.listeners[0].id).toEqual('bar');
    });
  });
  describe('Removes an existing event listener from the event object', () => {
    test('Removes listener with id = bar from the event object', () => {
      const event = new Event('foo');
      const listener = () => {};
      event.registerListener(listener, {id: 'bar'});
      const removedHandler = event.removeListener('bar');
      expect(removedHandler instanceof EventListener).toBe(true);
    });
  });
  describe('Runs all registered listeners when runHandlers is called', () => {
    test('Expects val to be false and bar to be 42', () => {
      const event = new Event('foo');
      let val = true;
      let bar = 0;
      event.registerListener(() => val = false);
      event.registerListener(() => bar = 42);
      event.runHandlers();
      expect([val, bar]).toEqual([false, 42]);
    });
  });
  describe('A persisted event will immediately execute newly registered listeners', () => {
    test('Expects val to be false and bar to be 42', () => {
      const event = new Event('foo', {persist: true});
      let val = true;
      event.registerListener(() => val = false);
      expect(val).toBeFalsy();
    });
  });
  describe('Removes a listener if its set to be deleted', () => {
    test('Expects listener length to be 0', () => {
      const event = new Event('foo');
      event.registerListener(() => {}, {isOnce: true});
      event.runHandlers();
      expect(event.listeners.length).toEqual(0);
    });
  });
  describe('Setting a max listener count limits the number of listeners in the pool', () => {
    test('Expects listener length to be 3', () => {
      const event = new Event('foo');
      event.limit(3);
      event.registerListener(() => {});
      event.registerListener(() => {});
      event.registerListener(() => {});
      event.registerListener(() => {});
      event.runHandlers();
      expect(event.listeners.length).toEqual(3);
    });
  });
});
