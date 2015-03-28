var OigMockElement = document.registerElement('oig-mock', {
  prototype: OigElement.prototype
});


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
  var oigObserverMock = setUpMock(new OigObserver());
  var oigViewModelResolverMock = setUpMock(OigViewModelResolver);

  oigLocator.register('oigResource', function () {
    return oigResourceMock;
  });

  oigLocator.register('oigObserver', function () {
    return oigObserverMock;
  });

  oigLocator.register('oigViewModelResolver', function () {
    return oigViewModelResolverMock;
  });

}())
