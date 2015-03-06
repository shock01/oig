'use strict';
function ObserverContext() {

}

ObserverContext.prototype = {
  /**
   *
   * @param {Object} object
   * @returns boolean
   */
  canObserve: function (object) {
    return object === Object(object) && !Object.isFrozen(object);
  }
};
