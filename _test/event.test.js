'use strict';
const Taste = require('@jikurata/taste');
const Event = require('../src/Event.js');

const test = new Promise((resolve, reject) => {
  Taste.flavor('Event Registration')
  .describe('Registers a function listener for the Event')
  .test(profile => {
    const event = new Event('foo');
    event.registerListener(() => {
      return true;
    });
    profile.listeners = event.listeners.length;
  })
  .expect('listeners').toEqual(1);

  Taste.flavor('Event Registration')
  .describe('Registers a function listener for the Event')
  .test(profile => {
    const event = new Event('foo');
    event.registerListener(() => {
      return true;
    });
    profile.listeners = event.listeners.length;
  })
  .expect('listeners').toEqual(1);

  Taste.flavor('Prioritizing Event Listeners')
  .describe('Setting option.priority: "first" will instruct the Event to shift the listener to the front of its listeners')
  .test(profile => {
    const event = new Event('foo');
    event.registerListener(() => {});
    event.registerListener(() => {}, {id: 'bar', priority: 'first'});
    for ( let i = 0; i < event.listeners.length; ++i ) {
      const listener = event.listeners[i];
      if ( listener.id === 'bar' ) {
        profile.listenerPosition = i;
      }
    }
  })
  .expect('listenerPosition').toEqual(0);

  Taste.flavor('Remove a listener from an Event')
  .test(profile => {
    const event = new Event('foo');
    const listener = () => {};
    event.registerListener(listener, {id: 'bar'});
    event.removeListener('bar');
    profile.listenerCount = event.listeners.length;
  })
  .expect('listenerCount').toEqual(0);

  Taste.flavor('Runs all registered listeners when runListeners is called')
  .test(profile => {
    const event = new Event('some-event');
    let foo = true;
    let bar = 0;
    event.registerListener(() => foo = false);
    event.registerListener(() => bar = 42);
    event.runListeners();
    profile.foo = foo;
    profile.bar = bar;
  })
  .expect('foo').toEqual(false)
  .expect('bar').toEqual(42);

  Taste.flavor('Event returns a promise that resolves when listeners finish')
  .test(profile => {
    const event = new Event('some-event');
    let foo = true;
    event.registerListener(() => foo = false);
    event.registerListener(() => new Promise((resolve, reject) => {
      setTimeout(() => {
        foo = 42;
        resolve();
      }, 500);
    }));
    event.runListeners()
    .then(() => {
      profile.foo = foo;
    });
  })
  .expect('foo').toEqual(42);

  Taste.flavor('Event catches thrown errors by listeners')
  .test(profile => {
    const event = new Event('some-event');
    event.registerListener(() => {});
    event.registerListener(() => { throw new Error('bar')});
    event.runListeners()
    .then(errors => {
      profile.errorCaught = true;
    })
    .catch(err => {
      profile.errorCaught = false;
    });
  })
  .expect('errorCaught').toBeTruthy();

  Taste.flavor('Event persistence')
  .describe('Persisted events will immediately execute newly registered listeners if the event has been emitted at least once')
  .test(profile => {
    const event = new Event('foo', {persist: true});
    let val = true;
    event.runListeners(false);
    event.registerListener((v) => {val = v});

    profile.val = val;
  })
  .expect('val').toBeFalsy();

  Taste.flavor('Listening to an event only once')
  .describe('Listener is deleted if a listener is invoked and options.once: true')
  .test(profile => {
    const event = new Event('foo');
    event.registerListener(() => {}, {once: true});
    event.runListeners()
    .then(() => {
      profile.listenerCount = event.listeners.length;
    })
    .catch(err => {
      profile.listenerCount = false;
    })
  })
  .expect('listenerCount').toEqual(0);

  Taste.flavor('Limiting maximum listeners on an Event')
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
  
  resolve();
});

module.exports = test;
