function setUpMock(proto) {
  'use strict';
  var instance = Object.create(proto, {});
  for (var i in proto) {
    if (typeof proto[i] === 'function') {
      // create empty method
      instance[i] = function() {};
    }
  }
  return instance;
}
