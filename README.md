# events
Lightweight javascript event listening library
---
## Install
```
npm install @dweomercraft/events
```
## Usage
```
const EventEmitter = require('@dweomercraft/events');

const emitter = new EventEmitter();
emitter.on('ping', () => {
  console.log('pong!');
});

emitter.emit('ping'); // pong!
```
Pass as many arguments as needed for your event handlers
```
emitter.on('val', (val1, val2) => {
  console.log(`I have ${val1} and ${val2}`);
});

emitter.emit('val', 3, 5); // I have 3 and 5;
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
