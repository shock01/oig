/**
* contains polyfill for es5 features which have not been implemented fully or
* that are broken (CustomEvent in IE)
*/
'use strict';
// polyfill window.event for firefox, also use strict cannot use arguments.callee.caller.arguments[0] to get event
if (!('event' in window)) {
  (function() {
    var currentEvent,
      keys = Object.keys(window),
      length = keys.length,
      key;

    var eventListener = function( /**Event*/ event) {
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
      },
      set: function(event) {
        currentEvent = event;
      }
    });
  }())
}
// polyfill for CustomEvent for PhantomJS and IE
if (typeof window.CustomEvent !== 'function') {
  (function() {
    function customEvent(event, params) {
      params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    customEvent.prototype = window.Event.prototype;
    window.CustomEvent = customEvent;
  })();
}
/* jshint ignore:start */
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

if (typeof WeakMap === 'undefined') {
  (function() {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    WeakMap.prototype = {
      set: function(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key)
          entry[1] = value;
        else
          defineProperty(key, this.name, {
            value: [key, value],
            writable: true
          });
        return this;
      },
      get: function(key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ?
          entry[1] : undefined;
      },
      delete: function(key) {
        var entry = key[this.name];
        if (!entry || entry[0] !== key) return false;
        entry[0] = entry[1] = undefined;
        return true;
      },
      has: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        return entry[0] === key;
      }
    };

    window.WeakMap = WeakMap;
  })();
}
/* jshint ignore:end */
