(function() {
  'use strict';
  // polyfill window.event for firefox, also use strict cannot use arguments.callee.caller.arguments[0] to get event
  if (!('event' in window)) {
    var currentEvent,
      keys = Object.keys(window),
      length = keys.length,
      key;

    var eventListener = function(event) {
      currentEvent = event;
    };

    while (length > 0) {
      key = keys[--length];
      if (key.substring(0, 2) === 'on') {
        window.addEventListener(key.substr(2), eventListener, true);
      }
    }
    Object.defineProperty(window, 'event', {
      get: function() {
        return currentEvent;
      }
    });
  }


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
