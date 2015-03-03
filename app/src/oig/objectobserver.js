'use strict';

/**
 *
 * @param {Object} observable
 * @constructor
 */
function ObjectObserver(observable) {

  /**
   * list of observers to notify on change
   * @type {Array<Function>}
   */
  var observers = [];

  /**
   * notifies all observers.
   * no data is passed to the observer because at the time of writing it's not needed (yet)
   */
  function notify() {
    observers.forEach(function (observer) {
      observer();
    });
  }

  /**
   *
   * @param {Object} observable
   * removes observers
   */
  function unobserve(observable) {
    if (observable === Object(observable)) {
      if (Array.isArray(observable)) {
        Array.unobserve(observable, arrayCallback);
      } else {
        Object.unobserve(observable, objectCallback);
      }
    }
  }

  /**
   * verify changes and calls notify
   * @param {Array.<>} changes
   */
  function objectCallback(changes) {
    changes.forEach(function (change) {
      if (change.type === 'delete') {
        unobserve(change.oldValue);
      } else if (change.type === 'add') {
        deepObserve(change.object[change.name]);
      }
    });
    notify();
  }

  /**
   * verify changes and calls notify
   * @param {Array.<>} changes
   */
  function arrayCallback(changes) {
    changes.forEach(function (change) {
      change.removed.forEach(function (item) {
        unobserve(item);
      });
    });
    notify();
  }

  /**
   *
   * @param {Object} observable
   */
  function deepObserve(observable) {
    if (observable === Object(observable)) {
      if (Array.isArray(observable)) {
        Array.observe(observable, arrayCallback);
        observable.forEach(function (value) {
          deepObserve(value);
        });
      } else {
        Object.observe(observable, objectCallback);
        Object.keys(observable).forEach(function (key) {
          deepObserve(observable[key]);
        });
      }
    }
  }

  /**
   *
   * @param {Function} observer
   */
  function observe(observer) {
    observers.push(observer);
    deepObserve(observable);
  }

  /**
   *
   * @param {Function} observer
   */
  function unObserve(observer) {
    var index = observers.indexOf(observer);
    if (index > -1) {
      observers.splice(index, 1);
    }
  }

  return {
    observe: observe,
    unObserve: unObserve,
    /**
     * publicly exposed for unit testing to make sure we can call deliverChangeRecords for easier TDD
     */
    objectCallback: objectCallback,
    arrayCallback: arrayCallback
  };
}

oig.ObjectObserver = ObjectObserver;
