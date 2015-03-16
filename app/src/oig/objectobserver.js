// @todo change to class/prototype and use serviceLocator
'use strict';

/**
 *
 * @todo change the observable argument so that DI can be used
 * observable should be set as property or passed as argument to observe
 *
 * @param {Object} observable
 * @param {ObserverContext} observerContext
 * @constructor
 */
function ObjectObserver(observable, observerContext) {

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
   * will push changes to the observers.
   * Object.observe is async but can be 'flushed'
   */
  function notifyAll() {
    Object.deliverChangeRecords(objectCallback);
    Object.deliverChangeRecords(arrayCallback);
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
   * will call observerContext to verify if object should be observed or not
   */
  function deepObserve(observable) {
    if (observable === Object(observable)) {
      if (!observerContext || observerContext.canObserve(observable)) {
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
    var index;
    if ((index = observers.indexOf(observer)) > -1) {
      observers.splice(index, 1);
      if (typeof observable === 'object' && typeof observer === 'function') {
        try {
          Object.unobserve(observable, observer);
        } catch (e) {
          // make sure that unobserve does not thrown. gracefully
        }
      }
    }
  }

  return {
    observe: observe,
    unObserve: unObserve,
    notifyAll: notifyAll
  };
}
