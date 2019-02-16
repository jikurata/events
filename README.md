# events v2.4.0
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
Make an instance of EventEmitter available globally
```
const firstEmitter = new EventEmitter({id: 'foo'});
const secondEmitter = EventEmitter.instanceOf('foo');
const thirdEmitter = new EventEmitter({id: 'foo'});
const localEmitter = new EventEmitter();

firstEmitter.on('bar', () => console.log('foobar'));
localEmitter.on('bar', () => console.log('not foo'));
secondEmitter.emit('bar');  // foobar
thirdEmitter.emit('bar');   // foobar
localEmitter.emit('bar');   // not foo
```
## API
---
**Class** EventEmitter(*EventEmitterOptions*)
#### Properties
- id: *String* Defines the EventEmitter at the global scope. When id is a falsy value, that instance of EventEmitter will not be available.
- events: Object containing all Events registered by the EventEmitter. Object keys are the event names.
- isEnabled: *Boolean*. When disabled, the emitter will suppress all emits. Registering and unregistering events will still occur regardless of this property.
#### Methods
- register(eventName)
  *Arguments*:
    {String} eventName: The name of the *Event* to be registered
  *Description*:
    Registers an *Event* with the name *eventName*

- unregister(eventName)
  *Arguments*:
    {String} eventName
  *Description*:
    Removes the Event object with the name *eventName*

- subscribe(eventName)
  *Arguments*:
    {String} eventName
  *Description*:
    Sets the Event's isActive property to true.
    Registered events are subscribed to by default.

- unsubscribe(eventName)
  *Arguments*:
    {String} eventName
  *Description*:
    Sets the Event's isActive property to false.
    If the event does not exist yet, it will register the event and then unsubscribe from it.

- enable()
  *Description*:
    Toggles isEnabled to be true

- disable()
  *Description*:
    Toggles isEnabled to be false

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
**Object** EventEmitterOptions
  - id (*Default: ''*): *Optional*. When id is a truthy value, the EventEmitter will be available globally.
  - enable (*Default: true*): *Optional*. Sets the initial state of the EventEmitter.
## Version Log
---
**v2.3.3**
- EventEmitter can now be set as a global reference by providing an id in its constructor.

**v2.3.2**
- Implemented *isEnabled* property for EventEmitter. When isEnabled is falsy, EventEmitter will suppress all emits. Registering and unregistering events will still occur regardless of this setting.

**v2.3.1**
- An issue where certain EventEmitter methods would throw an error when passed an invalid event name has been fixed.

**v2.3.0**
- Event objects now have the property *isActive* to determine whether an Event should execute its handlers or not. This property is set to true by default.
- The EventEmitter can toggle an Event's *isActive* property by using the *subscribe*() and *unsubscribe*() methods.
- The EventEmitter can now kill Events using the *unregister*() method. This will remove an Event, along with all of its handlers.
