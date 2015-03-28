(function () {

  // set up the serviceLocator

  var oigResource = new OigResource();

  oigLocator.register('oigResource', function () {
    return oigResource;
  });

  oigLocator.register('oigObserverContext', function () {
    return new OigObserverContext();
  });

  oigLocator.register('oigObserver', function () {
    return new OigObserver(oigLocator.resolve('oigObserverContext'));
  });

  oigLocator.register('oigViewModelResolver', function() {
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
}());


if (typeof define === 'function' && define.amd) {
  define('oig', [], function () {
    'use strict';
    return oig;
  });
}
if (typeof exports !== 'undefined') {
  exports.oig = oig;
}
