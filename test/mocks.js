(function () {
  'use strict';

  function setUpMock(proto) {
    var instance = Object.create(proto, {});
    for (var i in proto) {
      if (typeof proto[i] === 'function') {
        // create empty method
        instance[i] = function () {
        };
      }
    }
    return instance;
  }

  var oigResourceMock = setUpMock(OigResource.prototype);
  oigLocator.register('oigResource', function () {
    return oigResourceMock;
  });

}())
