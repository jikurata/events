'use strict';

class InvalidEventName extends TypeError {
  constructor(arg) {
    super(`Invalid Event Name: Expected a truthy String as an argument, received ${typeof arg} instead`);
  }

  static throwCheck(arg) {
    if ( typeof arg !== 'string' || arg.trim() === '' ) {
      throw new InvalidEventName(arg);
    }
  }
}

class InvalidListener extends TypeError {
  constructor(arg) {
    super(`Invalid Listener: Expected a Function as an argument, received ${typeof arg} instead`);
  }

  static throwCheck(arg) {
    if ( typeof arg !== 'function' ) {
      throw new InvalidListener(arg);
    }
  }
}

class ExceedsMaxListeners extends Error {
  constructor(event) {
    super(`Exceeds Max Listeners: ${event.name} has a maximum listener count of ${event.maxListenerCount}. Manually set the event's maximum pool by using its "setMaxListenerCount" setter.`);
  }

  static throwCheck(event) {
    // If the event's maximum listeners is set to 0 or any falsy value, then it has no limit
    if ( event.maxListenerCount > 0 && Object.keys(event.listeners).length >= event.maxListenerCount ) {
      throw new ExceedsMaxListeners(event);
    }
  }
}

module.exports.InvalidEventName = InvalidEventName;
module.exports.InvalidListener = InvalidListener;
module.exports.ExceedsMaxListeners = ExceedsMaxListeners;
