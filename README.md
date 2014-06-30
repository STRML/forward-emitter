Forward-emitter
==============

Forward events from one Node EventEmitter to another.

Installation
------------

`npm install forward-emitter`

Usage
-----

```javascript
var forward = require('forward-emitter');

// Basic forwarding
forward(src, dest);

// Forward only selected events
// In this example, only the 'connect' event is forwarded.
forward(src, dest, function (eventName) {
  return eventName === 'connect';
});

// Forward all events except exclusions
var exclusions = ['connect', 'disconnect'];
forward(src, dest, function(eventName) {
  return exclusions.indexOf(eventName) === -1;
});

```

How It Works
------------

`forward-emitter` listens to the `newListener` and `removeListener` events, introduced in Node `0.8` and
Node `0.10` respectively. When a callback is bound to an event on the destination emitter, the listener
is forwarded to the source emitter.

For that reason, this module should not be used in Node `< 0.10` if you plan to use `removeListener`.
