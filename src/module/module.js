'use strict';
var oig = (function() {
  // set up the serviceLocator

  var oig = {},
    oigEventBus = new OigEventBus(),
    oigAnnotationParser = new OigAnnotationParser(),
    oigTypeParser = new OigTypeParser(oigAnnotationParser),
    oigDIContext = new OigDIContext(oigTypeParser),
    oigViewContext = new OigViewContext(oigDIContext),
    oigValueContext = new OigValueContext();

  oigLocator
    .register('oigEventBus', function() {
      return oigEventBus;
    })
    .register('oigAnnotationParser', function() {
      return oigAnnotationParser;
    })
    .register('oigTypeParser', function() {
      return oigTypeParser;
    })
    .register('oigDIContext', function() {
      return oigDIContext;
    })
    .register('oigObserverContext', function() {
      return new OigObserverContext();
    })
    .register('oigObserver', function() {
      return new OigObserver(oigLocator.resolve('oigObserverContext'));
    })
    .register('oigViewContext', function() {
      return oigViewContext;
    })
    .register('oigValueContext', function() {
      return oigValueContext;
    });


  oig.bootstrap = oigBootstrap;
  oig.locator = oigLocator;
  oig.evaluate = oigEvaluate;
  /**
   * expose DIContext bind method on oigFacade
   * @param {String} name
   * @return {*|OigDIContext.Binding|function(this:*)}
   */
  oig.bind = function(name) {
    return new OigBindable(name);
  };
  return oig;
}());

if (typeof exports !== 'undefined') {
  exports.oig = oig;
}
