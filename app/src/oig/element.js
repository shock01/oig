'use strict';

/**
 * @see listenerelement.js
 *
 * @param {String} value
 * @returns {boolean}
 */
function attributeTruthy(value) {
  return typeof value === 'string' && (value === 'true' || value === '');
}

/**
 * WeakMap for storing ObjectObservers
 * weak lookup map that can be garbage collected
 */
var observerMap = new WeakMap();

/**
 * observes the datacontext and registers the element in the
 *
 * observerMap
 * @param {ContextElement} element
 */
function observeDataContext(element) {
  // watch dataContext changes
  var dataContext = element.dataContext,
    observer = element.update.bind(element);

  if (dataContext) {
    Object.observe(dataContext, observer);
    observerMap.set(element, observer);
  } else {
    throw '[oig:element] cannot observer dataContext for element: ' + element;
  }

}

/**
 * @class
 * @extends HTMLElement
 * @constructor
 */
function Element() {
}

Element.prototype = Object.create(HTMLElement.prototype, {
  /**
   * returns the data context of the current element
   * @returns {Object}
   */
  dataContext: {
    /**
     * returns the data context of the current element
     * @returns {Object}
     */
    get: function () {
      return oig.dataContext(this);
    }
  },
  /**
   * when attached to the DOM and attribute once is not thruthy then
   * add observers
   */
  attachedCallback: {
    value: function () {
      if (!attributeTruthy(this.getAttribute('once'))) {
        observeDataContext(this);
      }
    }
  },
  /**
   * clean up nicely to make sure we are not firing observers
   */
  detachedCallback: {
    value: function () {
      var dataContext = this.dataContext;
      if (observerMap.has(this)) {
        if (dataContext) {
          Object.unobserve(dataContext, observerMap.get(this));
        }
        observerMap.delete(this);
      }
    }
  },
  /**
   * update methods needs to be implemented by implementations
   * of this prototype
   */
  update: {
    value: function () {
      console.warn('[oig:element] not implemented (update)', this);
    }
  }
});

oig.Element = Element;

