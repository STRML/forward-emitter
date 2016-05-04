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

  it('should forward in a chain', function() {
    var a = new EventEmitter();
    var b = new EventEmitter();
    var c = new EventEmitter();

    forward(a, b);
    forward(b, c);

    var calls = 0;
    a.on('test', increment);
    b.on('test', increment);
    c.on('test', increment);
    function increment() {
      calls++;
    }

    a.emit('test', 'event payload');
    calls.should.equal(3);
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

  it('should not loop forever', function(done) {
    var src1 = new EventEmitter();
    var src2 = new EventEmitter();
    var src3 = new EventEmitter();
    var src4 = new EventEmitter();
    var dest = new EventEmitter();
    forward(src1, dest);
    forward(src2, dest);
    forward(src3, dest);
    forward(src4, dest);

    done();
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
