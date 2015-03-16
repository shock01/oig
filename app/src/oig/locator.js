/**
 * Service Locator pattern used to register/resolve.
 * DI can use a DI Aware resolvable
 */
var oigLocator = (function () {
  'use strict';

  /**
   *
   * @type {Object<String,Function>}
   */
  var services = {};

  /**
   *
   * @param {String} name
   * @param {Function} resolver
   * @throws [oig:locator] argument resolver should be function
   */
  function register(name, resolver) {
    if (typeof resolver !== 'function') {
      throw '[oig:locator] argument resolver should be function';
    }
    services[name] = resolver;
  }

  /**
   *
   * @param {String} name
   * @throws [oig:locator unresolvable: $name]
   * @returns {Object}
   */
  function resolve(name) {
    if (!services.hasOwnProperty(name)) {
      throw '[oig:locator] unresolvable: ' + name;
    }
    return services[name]();
  }

  return {
    register: register,
    resolve: resolve
  };

}());
