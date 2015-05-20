'use strict';
/**
 * Wrapper around oig locator for resolving view models
 */
/*exported OigViewModelResolver*/
var OigViewModelResolver = (function () {

  /**
   *
   * @param {string} name
   * @returns {Object}
   */
  function resolve(name) {
    return oigLocator.resolve(name);
  }

  return {
    resolve: resolve
  };
}());
