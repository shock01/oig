'use strict';

/**
* @param {String} key
*/
function OigBindable(key) {
  this.key = key;
}

OigBindable.prototype = {
  /**
  * @param {String} key
  * @returns {oigLocator}
  */
  to: function(value) {
    var key = this.key,
      context;

    context = (typeof value === 'string' || typeof value === 'number') ? oigLocator.resolve('oigValueContext') : oigLocator.resolve('oigDIContext');
    oigLocator.register(key, context.resolve.bind(context, key));
    return context.register(key, value);
  }
};
