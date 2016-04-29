'use strict';

var uuid = "7b589d15-ffae-4559-b3e4-9c913446711b"

module.exports = function forwardEmitter(src, dest, filterFn) {
  // If no filter is passed, forward all events.
  if (typeof filterFn !== 'function') {
    filterFn = function() { return true; };
  }


  function newListener(eventName, listener) {
    if (filterFn(eventName) && listener._uuid !== uuid) src.on(eventName, listener);
  }
  newListener._uuid = uuid;

  function removeListener(eventName, listener) {
    src.removeListener(eventName, listener);
  }
  removeListener._uuid = uuid;

  // Listeners bound to the destination emitter should be bound to the source emitter.
  dest.on('newListener', newListener);

  // When a listener is removed from the destination emitter, remove it from the source emitter
  // (otherwise it will continue to be called).
  dest.on('removeListener', removeListener);

};
