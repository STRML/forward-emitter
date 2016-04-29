'use strict';

module.exports = function forwardEmitter(src, dest, filterFn) {
  // If no filter is passed, forward all events.
  if (typeof filterFn !== 'function') {
    filterFn = function() { return true; };
  }

  function _7b589d15_ffae_4559_b3e4_9c913446711b_newListener(eventName, listener) {
    if (filterFn(eventName) && listener.name.indexOf('_7b589d15_ffae_4559_b3e4_9c913446711b_') !== 0) src.on(eventName, listener);
  }

  function _7b589d15_ffae_4559_b3e4_9c913446711b_removeListener(eventName, listener) {
    src.removeListener(eventName, listener);
  }

  // Listeners bound to the destination emitter should be bound to the source emitter.
  dest.on('newListener', _7b589d15_ffae_4559_b3e4_9c913446711b_newListener);

  // When a listener is removed from the destination emitter, remove it from the source emitter
  // (otherwise it will continue to be called).
  dest.on('removeListener', _7b589d15_ffae_4559_b3e4_9c913446711b_removeListener);

};
