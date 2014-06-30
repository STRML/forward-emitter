'use strict';
var should = require('should');
var EventEmitter = require('events').EventEmitter;
var forward = require('..');

/*global describe:true, it:true */
describe('forward(src, dest)', function() {
  it('should forward from src to dest', function(done) {
    var src = new EventEmitter();
    var dest = new EventEmitter();
    forward(src, dest);

    dest.on('test', function(a, b, c) {
      [].slice.call(arguments).should.eql([1,2,3]);
      done();
    });

    src.emit('test', 1, 2, 3);
  });

  it('emitters on src should continue to work', function(done){
    var src = new EventEmitter();
    var dest = new EventEmitter();
    forward(src, dest);

    src.on('test', done);
    src.emit('test');
  });

  it('should forward errors', function(done){
    var src = new EventEmitter();
    var dest = new EventEmitter();
    forward(src, dest);

    dest.on('error', function(err){
      err.message.should.equal('test error');
      done();
    });

    src.emit('error', new Error('test error'));
  });
});

describe('forward(src, dest, filterFn)', function() {
  it('should forward only an accepted event', function(done) {
    var src = new EventEmitter();
    var dest = new EventEmitter();
    forward(src, dest, function(eventName) {
      return eventName === 'accepted';
    });

    var calls = 0;
    function increment() {
      calls++;
    }

    dest.on('accepted', increment);
    dest.on('foo', increment);
    dest.on('bar', increment);

    src.emit('accepted');
    src.emit('foo');
    src.emit('bar');

    calls.should.equal(1);
    done();
  });

  it('should forward everything but exclusions', function(done) {
    var src = new EventEmitter();
    var dest = new EventEmitter();
    var exclusions = ['foo', 'bar'];
    forward(src, dest, function(eventName) {
      return exclusions.indexOf(eventName) === -1;
    });

    var calls = 0;
    function increment() {
      calls++;
    }

    dest.on('accepted', increment);
    dest.on('foo', increment);
    dest.on('bar', increment);

    src.emit('accepted');
    src.emit('foo');
    src.emit('bar');

    calls.should.equal(1);
    done();
  });
});
