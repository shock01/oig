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
  var oigAnnotationParserMock = setUpMock(OigAnnotationParser.prototype);
  var oigDIContextMock = setUpMock(OigDIContext.prototype);
  var oigTypeParser = setUpMock(OigTypeParser.prototype);
  var oigObserverMock = setUpMock(new OigObserver());
  var oigViewModelResolverMock = setUpMock(OigViewModelResolver);

  oigLocator
    .register('oigResource', function () {
      return oigResourceMock;
    })
    .register('oigAnnotationParser', function () {
      return oigAnnotationParserMock;
    })
    .register('oigObserver', function () {
      return oigObserverMock;
    })
    .register('oigTypeParser', function () {
      return oigTypeParser;
    })
    .register('oigDIContext', function () {
      return oigDIContextMock;
    })
    .register('oigViewModelResolver', function () {
      return oigViewModelResolverMock;
    });

}())
