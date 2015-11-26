'use strict';
var oig;
(function(oig) {
  /**
   * Service Locator pattern used to register/resolve.
   * used internally by oig for IOC.
   * @todo add method to verify if locator has item by key
   * @todo use a normal prototype instead of a singleton function
   */
  function Locator() {

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
     * @returns {locator}
     */
    this.register = function(name, resolver) {
      if (typeof resolver !== 'function') {
        throw '[oig:locator] argument resolver should be function';
      }
      services[name] = resolver;
      return this;
    };

    /**
     *
     * @param {String} name
     * @throws [oig:locator unresolvable: $name]
     * @returns {Object}
     */
    this.resolve = function(name) {
      if (!services.hasOwnProperty(name)) {
        throw '[oig:locator] unresolvable: ' + name;
      }
      return services[name](name);
    };
  }

  oig.Locator = Locator;
}(oig || (oig = {})));
