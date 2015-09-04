/*exported OigValueResolver */
'use strict';

var OigValueResolver = (function() {

  var values = {};

  function resolve(name) {
    return values[name];
  }

  function register(key, value, mutable) {
    try {
      Object.defineProperty(values, key, {
        value: value,
        writable: mutable
      });
    } catch (e) {
    throw '[oig:valueresolver] attempt to rewrite value property: ' + key;
    }
  }

  return {
    resolve: resolve,
    register: register
  };

}());
