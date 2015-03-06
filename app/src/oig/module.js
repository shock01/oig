Object.defineProperty(oig, 'resource', {
  get: function () {
    return oigResource;
  }
});

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

if (typeof define === 'function' && define.amd) {
  define('oig', [], function () {
    'use strict';
    return oig;
  });
}
if (typeof exports !== 'undefined') {
  exports.oig = oig;
}
