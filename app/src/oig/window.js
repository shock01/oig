(function() {
  'use strict';

  Object.defineProperties(window, {
    '$viewModel': {
      get: function() {
        var element = this.event.target;
        return oig.locator.resolve('oigViewContext').resolve(element).viewModel;
      }
    },
    '$view': {
      get: function() {
        var element = this.event.target;
        return oig.locator.resolve('oigViewContext').resolve(element).view;
      }
    }
  });
}());
