/*exported oigLocator */
'use strict';
/**
 * Service Locator pattern used to register/resolve.
 * DI can use a DI Aware resolvable
 */
var oigLocator = (function() {

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
   * @returns {OigLocator}
   */
  function register(name, resolver) {
    if (typeof resolver !== 'function') {
      throw '[oig:locator] argument resolver should be function';
    }
    services[name] = resolver;
    return oigLocator;
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
    return services[name](name);
  }

  /**
   *
   * @param {Sting} name
   */
  function remove(name) {
    services[name] = null;
    delete services[name];
  }

  return {
    register: register,
    resolve: resolve,
    remove: remove
  };

}());
