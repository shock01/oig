'use strict';
/**
 *
 * @param {String }body
 * @returns {string}
 */
function appContextBuildMethodBody(body) {
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
function oigEvaluate(dataContext, methodBody, additionalArguments) {
  var args = ['dataContext'],
    parameters = [dataContext];

  /**
   * add any optional arguments to the args and parameters
   * which will be executed and parsed to new function
   */
  if (typeof additionalArguments === 'object') {
    // @todo use for-of loop (for key of Object.keys())
    Object.keys(additionalArguments).forEach(function( /**String*/ name) {
      args.push(name);
      parameters.push(additionalArguments[name]);
    });
  }

  /*jshint evil: true */
  return new Function(args.join(','), appContextBuildMethodBody(methodBody)).apply(null, parameters);
  /*jshint evil: false */
}
