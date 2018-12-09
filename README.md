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
### API
---
class **EventEmitter**
#### Properties
**events** Map containing eventName-Event key-value pairs
#### Methods
register(eventName)

addEventListener(eventName, handler, options)

on(eventName, handler)

once(eventName, handler)

dispatchEvent(eventName)

emit(eventName)
