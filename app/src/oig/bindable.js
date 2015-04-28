'use strict';

function OigBindable(key) {
  this.key = key;
}

OigBindable.prototype = {
  to: function (value) {
    var key = this.key,
      context;
    if (typeof value === 'string' || typeof value === 'number') {
      context = oigLocator.resolve('oigValueContext');
    } else {
      context = oigLocator.resolve('oigDIContext');
    }
    oigLocator.register(key, context.resolve.bind(context, key));
    return context.register(key, value);
  }
};
