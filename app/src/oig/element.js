'use strict';

/**
 * @see listenerelement.js
 *
 * @param {String} value
 * @returns {boolean}
 */
function elementAttributeTruthy(value) {
  return typeof value === 'string' && (value === 'true' || value === '');
}

/**
 * WeakMap for storing ObjectObservers
 * weak lookup map that can be garbage collected
 */
var elementObserverMap = new WeakMap();

/**
 * observes the datacontext and registers the element in the
 *
 * elementObserverMap
 * @param {Element} element
 */
function elementObserveDataContext(element) {
  // watch dataContext changes
  var dataContext = element.dataContext,
    observer,
    notifier = element.update.bind(element);

  if (dataContext) {
    observer = oigLocator.resolve('oigObserver');
    observer.observe(dataContext, notifier);
    elementObserverMap.set(element, {
      objectObserver: observer,
      observer: notifier
    });
  } else {
    throw '[oig:element] cannot observer dataContext for element: ' + element;
  }
}

/**
 *
 * @param {Element} element
 */
function elementUnObserveDataContext(element) {
  var observerContext;
  if (elementObserverMap.has(element)) {
    observerContext = elementObserverMap.get(element);
    observerContext.objectObserver.unObserve(observerContext.observer);
    elementObserverMap.delete(element);
  }
}

/**
 * @class
 * @extends HTMLElement
 * @constructor
 */
function OigElement() {
}

OigElement.prototype = Object.create(HTMLElement.prototype, {
  /**
   * @type {OigObserver}
   */
  objectObserver: {
    value: null,
    writable: true
  },
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
      return dataContextResolver(this);
    }
  },
  /**
   * when attached to the DOM and attribute once is not thruthy then
   * add observers
   */
  attachedCallback: {
    value: function () {
      if (!elementAttributeTruthy(this.getAttribute('once'))) {
        elementObserveDataContext(this);
      }
    }
  },
  /**
   * clean up nicely to make sure we are not firing observers
   */
  detachedCallback: {
    value: function () {
      elementUnObserveDataContext(this);
    }
  },
  /**
   * update methods needs to be implemented by implementations
   * of this prototype
   */
  update: {
    value: function () {

    }
  }
});
