var oig;
(function (oig) {
  'use strict';
  /**
   *
   * @type {Object}
   * container that should have getters for all viewmodels
   * example:
   * oig.viewModels = {
   *  get test() {
   *    cdi/ioc can be done overhere to get constructor arguments etc
   *    return something
   *  }
   * }
   */
  // @todo move me to a better place please
  var viewModels = {};

  Object.defineProperty(oig, 'viewModels', {
    get: function () {
      return viewModels;
    },
    set: function () {
      throw '[oig:appcontext] viewModels property cannot be set directly';
    }
  });


  /**
   *
   * @param {String }body
   * @returns {string}
   */
  function buildMethodBody(body) {
    return 'try {with(dataContext) { return ' + body + '}} catch(e) {console.error(\'[oig-evaluate error]\', e)}';
  }

  /**
   *
   * executes a method / expression on the viewModel.
   * All properties and methods of the viewModel are accessible as variables.
   *
   * additionalArguments can be passed like DOMEvent for event listeners
   *
   *
   * @param {Object} dataContext
   * @param {string} methodBody
   * @param {Object=} additionalArguments
   * @returns {*}
   */
  oig.evaluate = function (dataContext, methodBody, additionalArguments) {
    var args = ['dataContext'],
      parameters = [dataContext];

    /**
     * add any optional arguments to the args and parameters
     * which will be executed and parsed to new function
     */
    if (typeof additionalArguments === 'object') {
      // @todo use for-of loop (for key of Object.keys())
      Object.keys(additionalArguments).forEach(function (/**String*/name) {
        args.push(name);
        parameters.push(additionalArguments[name]);
      });
    }

    /*jshint evil: true */
    return new Function(args.join(','), buildMethodBody(methodBody)).apply(this, parameters);
    /*jshint evil: false */
  };

}/* jshint ignore:start */(oig || (oig = {}))/* jshint ignore:end */);

