(function () {

  // set up the serviceLocator

  var oigResource = new OigResource();

  oigLocator.register('oigResource', function () {
    return oigResource;
  });

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
