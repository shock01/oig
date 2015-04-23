'use strict';
(function () {
  // set up the serviceLocator

  var oigEventBus = new OigEventBus(),
    oigResource = new OigResource(),
    oigAnnotationParser = new OigAnnotationParser(),
    oigTypeParser = new OigTypeParser(),
    oigDIContext = new OigDIContext(),
    oigValueContext = new OigValueContext();

  oigLocator
    .register('oigEventBus', function () {
      return oigEventBus;
    })
    .register('oigResource', function () {
      return oigResource;
    })
    .register('oigAnnotationParser', function () {
      return oigAnnotationParser;
    })
    .register('oigTypeParser', function () {
      return oigTypeParser;
    })
    .register('oigDIContext', function () {
      return oigDIContext;
    })
    .register('oigObserverContext', function () {
      return new OigObserverContext();
    })
    .register('oigObserver', function () {
      return new OigObserver(oigLocator.resolve('oigObserverContext'));
    })
    .register('oigViewModelResolver', function () {
      return OigViewModelResolver;
    })
    .register('oigValueContext', function () {
      return oigValueContext;
    });

  oig.locator = oigLocator;

  // export the elements
  window.OigBindingElement = OigBindingElement;
  window.OigContextElement = OigContextElement;
  window.OigIfElement = OigIfElement;
  window.OigIncludeElement = OigIncludeElement;
  window.OigReactElement = OigReactElement;
  window.OigTemplateElement = OigTemplateElement;

  // facade

  function OigBindable(key) {
    this.key = key;
  }

  OigBindable.prototype = {
    to: function (value) {
      var key = this.key,
        context;
      if(typeof value === 'string' || typeof value === 'number') {
        context = oigLocator.resolve('oigValueContext');
      } else {
        context = oigLocator.resolve('oigDIContext');
      }
      oigLocator.register(key, context.resolve.bind(context, key));
      return context.register(key, value);
    }
  };

  /**
   * expose DIContext bind method on oigFacade
   * @param {String} name
   * @return {*|OigDIContext.Binding|function(this:*)}
   */
  oig.bind = function (name) {
    return new OigBindable(name);
  };

}());


if (typeof define === 'function' && define.amd) {
  define('oig', [], function () {
    return oig;
  });
}
if (typeof exports !== 'undefined') {
  exports.oig = oig;
}
