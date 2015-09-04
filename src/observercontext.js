/*exported OigObserverContext */
'use strict';
/**
 *
 * @constructor
 */
function OigObserverContext() {

}

OigObserverContext.prototype = {
  /**
   *
   * @param {Object} object
   * @returns boolean
   */
  canObserve: function(object) {
    return object === Object(object) && !Object.isFrozen(object);
  }
};
