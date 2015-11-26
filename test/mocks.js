'use strict';
var noop = function() {};
/* jshint unused: false */

function setUpMock(proto) {
  var instance = Object.create(proto, {});
  for (var i in proto) {
    if (typeof proto[i] === 'function') {
      // create empty method
      instance[i] = noop;
    }
  }
  return instance;
}
