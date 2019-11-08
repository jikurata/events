# events v3.0.0
Lightweight javascript event listening library
---
## Install
```
npm install @jikurata/events
```
## Usage
```
const EventEmitter = require('@jikurata/events');

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
Asynchronous Listeners are OK
```
emitter.on('event', () => {
  // Synchronous Code
});

// EventListener should return a Promise so it can be handled asynchronously
emitter.on('event', () => new Promise((resolve, reject) => {
  // Asynchronous code
  resolve();
}));

emitter.emit('event')
.then(() => {
  // Do something after all listeners have finished
})

```
Any errors thrown by EventListeners are caught by the EventEmitter and passed to the 'error' event
```
emitter.on('error', (err) => {
  // Do something with an error
});

emitter.on('event', () => {
  throw new Error('woops');
})

emitter.emit('event')
.then(() => {
  // This code still runs
})
```
## Documentation
---
### **Class** EventEmitter() ###
#### Methods ####
#### **registerEvent**(*eventName*) ####
- Arguments:
  - eventName {String}: The name of the *Event* to be registered

#### **unregisterEvent**(*eventName*) ####
- Arguments:
  - eventName {String}


#### **addEventListener**(*eventName*, *listener*, *options*) ####
- Arguments:
  - eventName {String}
    listener {Function}: A function to be called when the *Event* is triggered
    options {*EventListenerOptions*}: Configuration for the *EventListener*
- Description:
  - Registers the event if it does not exist yet, and adds the listener to the *Event* object. Returns the id of the assigned listener.


#### **on**(*eventName*, *listener*, *options*) ####
- Description:
  - Wrapper for addEventListener.

#### **once**(*eventName*, *listener*) ####
- Description: 
  - Wrapper for addEventListener. Passes {once: true} as the option.

#### **dispatchEvent**(*eventName*, *...args*) ####
- Arguments:
  - eventName {String}
  - ...args {...Any}: Any arguments to pass to the event's EventListeners
- Description:
  - Triggers the event, calls all of the listeners assigned to the *Event*.

#### **emit**(*eventName*, *...args*) ####
- Description:
  - Wrapper for dispatchEvent.

#### **removeEventListener**(*eventName*, *id*) ####
- Arguments:
  - eventName {String}
  - id {String}: the id of the listener
- Description:
  - Removes a listener from the specified *Event*.
---
### **Object** *EventOptions* ###
#### Properties ####
  - persist {String}: (Default: false). When true and the event has been emitted at least once, the event will immediately execute any newly registered listeners
  - limit {Number}: (Default: 0 (No limit)): Restrict the event's listener pool size
---
### **Object** *EventListenerOptions* ###
#### Properties ####
  -  id {String}: Manually define the id of the EventListener
  -  once {Boolean}: (Default: false) Instructs the EventEmitter to call the listener only once
  -  priority {String}: (Default: 'last') Setting this property to 'first' will add the listener to the front of the queue. 
## Version Log
---
**v3.0.0**
- Implemented support for asynchronous EventListeners
- Emitting an event now returns a promise that resolves after all listeners have finished
- Errors thrown by listeners are passed to the 'error' event
- Implemented module specific errors for improved debugging
- Removed previous implementations:
  1. EventEmitter no longer has an enable/disable state.
  2. Events no longer have a subscribe/unsubscribe state.
- TODO: Expand upon module specific errors


**v2.5.4**
- Refactor tests to Taste tests

**v2.5.3**
- Persisted events will now only execute newly added listeners if the event has been emitted at least once

**v2.5.2**
- Fixed additional handler to listener semantics

**v2.5.0**
- Renamed EventHandler to EventListener
- Events can now limit the total number of listeners in its pool
- Events can persist its state, allowing it to immediate pass its state to newly registered listeners
- Refactored how Events handle Listeners registered to occur once

**v2.4.2**
- Fixed a bug that allowed a null handler argument to bypass a validation check

**v2.4.1**
- Fixed a bug with ```options.priority = 'first'``` that caused the Event to remove an event from the list, instead of adding one.

**v2.4.0**
- Event's handler property is now an Array queue. id referencing now occurs at the EventHandler level.
- Implement option to add a new handler to the front or end of the handler queue.
- Implement option to define the handler id.

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
