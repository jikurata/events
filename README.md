# events v2.5.0
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
## Documentation
---
**Class** EventEmitter(*EventEmitterOptions*)
#### Properties
- **id**: *String* Defines the EventEmitter at the global scope. When id is a falsy value, that instance of EventEmitter will not be available.
- **events**: Object containing all Events registered by the EventEmitter. Object keys are the event names.
- **isEnabled**: *Boolean*. When disabled, the emitter will suppress all emits. Registering and unregistering events will still occur regardless of this property.
#### Methods
- **register**(*eventName*)<br>
  *Arguments*:<br>
    {*String*} eventName: The name of the *Event* to be registered<br>
  *Description*:<br>
    Registers an *Event* with the name *eventName*<br>

- **unregister**(*eventName*)<br>
  *Arguments*:<br>
    {*String*} eventName<br>
  *Description*:<br>
    Removes the Event object with the name *eventName*<br>

- **subscribe**(*eventName*)<br>
  *Arguments*:<br>
    {*String*} eventName<br>
  *Description*:<br>
    Sets the Event's isActive property to true.<br>
    Registered events are subscribed to by default.<br>

- **unsubscribe**(*eventName*)<br>
  *Arguments*:<br>
    {*String*} eventName<br>
  *Description*:<br>
    Sets the Event's isActive property to false.<br>
    If the event does not exist yet, it will register the event and then unsubscribe from it.<br>

- **enable**()<br>
  *Description*:<br>
    Toggles isEnabled to be true<br>

- **disable**()<br>
  *Description*:<br>
    Toggles isEnabled to be false<br>

- **addEventListener**(*eventName*, *listener*, *options*)<br>
  *Arguments*:<br>
    {*String*} eventName<br>
    {*Function*} listener: A function to be called when the *Event* is triggered<br>
    {*EventListenerOptions*} options (Optional):<br>
  *Description*:<br>
    Registers the event if it does not exist yet, and adds the listener to the *Event* object.<br>
    Returns the id of the assigned listener.<br>


- **on**(*eventName*, *listener*, *options*)<br>
  *Description*: Wrapper for addEventListener. Passes {once: false} as the option.<br>

- **once**(*eventName*, *listener*)<br>
  *Description*: Wrapper for addEventListener. Passes {once: true} as the option.<br>

- **dispatchEvent**(*eventName*, *...args*)<br>
  *Arguments*:<br>
    {*String*} eventName<br>
    {*any*} arg1, arg2, argN...: Arguments to be passed into the *Event*'s *EventListeners*<br>
  *Description*:<br>
    Triggers the event, calls all of the listeners assigned to the *Event*.<br>

- **emit**(*eventName*, *...args*)<br>
  *Description*:<br>
    Wrapper for dispatchEvent. Exists for semantic purposes.<br>

- **removeEventListener**(*eventName*, *id*)<br>
  *Arguments*:<br>
    {*String*} eventName<br>
    {*String*} id: The id of the *EventListener*<br>
  *Description*:<br>
    Removes a listener from the specified *Event*<br>
    
**Object** *EventEmitterOptions*<br>
  - id {*String*} (*Default: ''*): *Optional*. When id is a truthy value, the EventEmitter will be available globally.<br>
  - enable {*Boolean*} (*Default: true*): *Optional*. Sets the initial state of the EventEmitter.

**Object** *EventOptions*<br>
  - persist {*String*} (*Default: false*): *Optional*. Immediately emit the current event state to any newly registered listeners.<br>
  - subscribe {*Boolean*} (*Default: true*): *Optional*. When emitted, the event will execute its listeners.<br>
  - limit {*Number*} (*Default: null (No limit)*): *Optional*. Restrict the event's listener pool size

**Object** *EventListenerOptions*<br>
  -  id: {*String*}: Defines the id of the EventListener<br>
  -  once: {*Boolean*} (*Default: false*): Tells the EventEmitter to call the listener only once<br>
  -  priority: {*String*}: Setting this property to **'first'** will add the listener to the front of the queue. Default behavior adds listeners to the end.
## Version Log
---
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
- EventEmitter can now be set as a global reference by providing an id in its constructor.<br>

**v2.3.2**
- Implemented *isEnabled* property for EventEmitter. When isEnabled is falsy, EventEmitter will suppress all emits. Registering and unregistering events will still occur regardless of this setting.<br>

**v2.3.1**
- An issue where certain EventEmitter methods would throw an error when passed an invalid event name has been fixed.<br>

**v2.3.0**
- Event objects now have the property *isActive* to determine whether an Event should execute its handlers or not. This property is set to true by default.
- The EventEmitter can toggle an Event's *isActive* property by using the *subscribe*() and *unsubscribe*() methods.
- The EventEmitter can now kill Events using the *unregister*() method. This will remove an Event, along with all of its handlers.<br>
