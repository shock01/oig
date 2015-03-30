/**
 * Wrapper around oig locator for resolving view models
 */
var OigViewModelResolver = (function () {
  'use strict';

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
  }
}());
