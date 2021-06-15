'use strict';
const Taste = require('@jikurata/taste');
const Event = require('../src/Event.js');
const EventListener = require('../src/EventListener.js');

Taste('Event Registration')
.test('Registers a function listener for the Event', profile => {
  const event = new Event('foo');
  const id = event.registerListener(() => {
    return true;
  });
  profile.listenerCount = Object.keys(event.listeners).length;
  profile.listener = event.getListener(id);
})
.expect('listenerCount').toEqual(1)
.expect('listener').toBeInstanceOf(EventListener);

Taste('Remove a listener from an Event')
.test(profile => {
  const event = new Event('foo');
  const id = event.registerListener(() => { return true; });
  event.removeListener(id);
  profile.listenerCount = Object.keys(event.listeners).length;
})
.expect('listenerCount').toEqual(0);

Taste('Runs all registered listeners when handle is called')
.test(profile => {
  const event = new Event('some-event');
  let foo = true;
  let bar = 0;
  event.registerListener(() => foo = false);
  event.registerListener(() => bar = 42);
  event.handle();
  profile.foo = foo;
  profile.bar = bar;
})
.expect('foo').toEqual(false)
.expect('bar').toEqual(42);

Taste('Event persistence')
.test('Persisted events will immediately execute newly registered listeners if the event has been emitted at least once', profile => {
  const event = new Event('foo', {persist: true});
  let val = false;
  event.handle(true);
  event.registerListener((v) => {val = v});
  profile.val = val;
})
.expect('val').toBeTruthy();

Taste('Listening to an event only once')
.test('Listener is deleted if a listener is invoked and options.once: true', profile => {
  const event = new Event('foo');
  let counter = 0;
  const id = event.registerListener(() => ++counter, {once: true});
  event.handle();
  event.handle();
  profile.exists = event.getListener(id);
  profile.counter = counter;
})
.expect('exists').toBeFalsy()
.expect('counter').toEqual(1);

Taste('Limiting maximum listeners on an Event')
.test(profile => {
  const event = new Event('foo');
  event.maxListenerCount = 3;
  event.registerListener(() => {});
  event.registerListener(() => {});
  event.registerListener(() => {});
  try {
    event.registerListener(() => {});
    profile.exceedLimit = false;
  }
  catch(err) {
    profile.exceedLimit = true;
  }
})
.expect('exceedLimit').toBeTruthy();

module.exports = Taste;
