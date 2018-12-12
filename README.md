# events
Lightweight javascript event listener library
---
## Install
```
npm install @jikurata/events
```
## Usage
```
const EventEmitter = require('@jikurata/events');

const emitter = new EventEmitter();
emitter.on('eventName', () => {
  console.log('eventName has been triggered!');
});

emitter.emit('eventName'); // 'eventName has been triggered!'
```
Pass as many arguments as needed for your event handlers
```
emitter.on('foo', (val1, val2) => {
  const sum = val1 + val2;
  console.log(`Sum: ${sum}`);
});

emitter.emit('foo', 3, 5); // 'Sum: 8';
```
### API
---
**Class** EventEmitter
#### Properties
- events: Object containing all Events registered by the EventEmitter. Object keys are the event names.
#### Methods
- register(eventName)
  *Arguments*:
    {String} eventName: The name of the *Event* to be registered
  *Description*:
    Registers an *Event* with the name *eventName*

- addEventListener(eventName, handler, options)
  *Arguments*:
    {String} eventName
    {Function} handler: A function to be called when the *Event* is triggered
    {Object} options (Optional):
      Properties:
        once: true/false
          Tells the EventEmitter to call the handler only once
  *Description*:
    Registers the event if it does not exist yet, and adds the handler to the *Event* object.
    Returns the id of the assigned handler.


- on(eventName, handler)
  *Description*: Wrapper for addEventListener. Passes {once: false} as the option.

- once(eventName, handler)
  *Description*: Wrapper for addEventListener. Passes {once: true} as the option.

- dispatchEvent(eventName, ...args)
  *Arguments*:
    {String} eventName
    {any} arg1, arg2, argN...: Arguments to be passed into the *Event*'s *EventHandlers*
  *Description*:
    Triggers the event, calls all of the handlers assigned to the *Event*.

- emit(eventName, ...args)
  *Description*:
    Wrapper for dispatchEvent. Exists for semantic purposes.

- removeEventListener(eventName, id)
  *Arguments*:
    {String} eventName
    {String} id: The id of the *EventHandler*
  *Description*:
    Removes a handler from the specified *Event*

**Class** Event
#### Properties
- name: String that defines the Event name
- handlers: Object containing all EventHandlers assigned to the event
#### Methods
- runHandlers(..args)
  *Description*:
    Calls all handler functions assigned to the Event

- registerHandler(handler, isOnce)
  *Properties*:
    {Function} handler
    {Boolean} isOnce: Defaults to false
  *Description*:
    Registers a handler to the event

- removeHandler(id)
  *Properties*:
    {String} id
  *Description*:
    Removes the handler associated with the id.


**Class** EventHandler
#### Properties
- id: id of the EventHandler
- handler: Function associated with the EventHandler
- isOnce: Boolean Determines if this EventHandler should be called once.
#### Methods
run(...args) 
*Description*
  Calls the handler funciton. Any arguments get passed to the handler.
