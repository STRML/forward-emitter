'use strict';

module.exports = function forwardEmitter(src, dest, filterFn) {
  // If no filter is passed, forward all events.
  if (typeof filterFn !== 'function') {
    filterFn = function() { return true; };
  }

  function __forward_emitter_newListener(eventName, listener) {
    if (filterFn(eventName) && listener.name.indexOf('__forward_emitter_') !== 0) src.on(eventName, listener);
  }

  function __forward_emitter_removeListener(eventName, listener) {
    src.removeListener(eventName, listener);
  }

  // Listeners bound to the destination emitter should be bound to the source emitter.
  dest.on('newListener', __forward_emitter_newListener);

  // When a listener is removed from the destination emitter, remove it from the source emitter
  // (otherwise it will continue to be called).
  dest.on('removeListener', __forward_emitter_removeListener);

};
