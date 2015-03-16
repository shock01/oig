Object.defineProperty(oig, 'ObjectObserver', {
  get: function () {
    return ObjectObserver;
  }
});

Object.defineProperty(oig, 'ObserverContext', {
  get: function () {
    return ObserverContext;
  }
});

/**
 * service locator configuration
 */
oigLocator.register('oig.resource', function () {
  return oigResource;
});

if (typeof define === 'function' && define.amd) {
  define('oig', [], function () {
    'use strict';
    return oig;
  });
}
if (typeof exports !== 'undefined') {
  exports.oig = oig;
}
