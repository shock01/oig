'use strict';
(function () {
  // set up the serviceLocator

  var oigResource = new OigResource(),
    oigAnnotationParser = new OigAnnotationParser(),
    oigTypeParser = new OigTypeParser(),
    oigDIContext = new OigDIContext();

  oigLocator
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

  /**
   *
   * @param {String} name
   * @return {Object|*}
   */
  function oigDIResolver(name) {
    return oigLocator.resolve('oigDIContext').resolve(name);
  }

  /**
   * expose DIContext bind method on oigFacade
   * @param {String} name
   * @return {*|OigDIContext.Binding|function(this:*)}
   */
  oig.bind = function (name) {
    oigLocator.register(name, oigDIResolver);
    return oigLocator.resolve('oigDIContext').bind(name);
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
