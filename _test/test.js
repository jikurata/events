'use strict';
const ErrorTest = require('./error.test.js');
const EventTest = require('./event.test.js');
const EmitterTest = require('./eventemitter.test.js');

ErrorTest
.then(() => EventTest)
.then(() => EmitterTest);
