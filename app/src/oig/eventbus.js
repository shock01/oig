'use strict';
function OigEventBus() {
  /**
   *
   * @type {{string,Array<OigEventBus.Handler>}}
   */
  this.eventRegistrations = {};
}

OigEventBus.prototype = {
  /**
   * will call all handlers registered for the given eventName
   * @param {String} eventName
   * @param {Object?} eventDetails
   */
  trigger: function (eventName, eventDetails) {
    var registrations = this.eventRegistrations[eventName];
    if (Array.isArray(registrations)) {
      registrations.forEach(function (/**OigEventBus.Registration*/handler) {
        handler.trigger(eventDetails);
      });
    }
  },

  /**
   *
   * @param {String} eventName
   * @param {Function} callback
   * @return {OigEventBus.Registration}
   */
  register: function (eventName, callback) {
    if (!this.eventRegistrations.hasOwnProperty(eventName)) {
      this.eventRegistrations[eventName] = [];
    }
    var registrations = new OigEventBus.Registration(this, eventName, callback);
    this.eventRegistrations[eventName].push(registrations);
    return registrations;
  },
  /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */
  unregister: function (eventName, callback) {
    var registrations = this.eventRegistrations[eventName];
    if (Array.isArray(registrations)) {
      this.eventRegistrations[eventName] = registrations.filter(function (/**OigEventBus.Registration*/handler) {
        return handler.callback !== callback;
      });
    }
  },
  dispose: function () {
    this.eventRegistrations = {};
  }
};

/**
 *
 * @param {OigEventBus} eventBus
 * @param {String} eventName
 * @param {Function} callback
 * @constructor
 */
OigEventBus.Registration = function (eventBus, eventName, callback) {
  this.eventBus = eventBus;
  this.eventName = eventName;
  this.callback = callback;
};
OigEventBus.Registration.prototype = {
  dispose: function () {
    this.eventBus.unregister(this.eventName, this.callback);
  },
  /**
   * wrapped in try catch to make sure the eventBus trigger continues
   * will dispatch oigError event on eventBus
   * @param {Object} eventDetails
   */
  trigger: function (eventDetails) {
    try {
      this.callback(eventDetails);
    } catch (e) {
      this.eventBus.trigger('oigError', e);
    }
  }
};
