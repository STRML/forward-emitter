Forward-emitter
==============

Forward events from one Node EventEmitter to another.

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
