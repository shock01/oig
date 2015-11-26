'use strict';
var oig;
(function(oig) {
  // @todo add a global event handling mechanism like: __oig__
  function EventBus() {
    /**
     *
     * @type {{string,Array<EventBus.Handler>}}
     */
    this.eventRegistrations = {};
  }

  EventBus.prototype = {
    /**
     * will call all handlers registered for the given eventName
     * @param {String} eventName
     * @param {Object?} eventDetails
     */
    trigger: function(eventName, eventDetails) {
      var registrations = this.eventRegistrations[eventName];
      // @todo concat with global if present __oig__
      if (Array.isArray(registrations)) {
        registrations.forEach(function( /**EventBus.Registration*/ handler) {
          // @todo setTimeout can be also done here ?? or will it mess up
          handler.trigger(eventDetails);
        });
      }
    },

    /**
     *
     * @param {String} eventName
     * @param {Function} callback
     * @return {EventBus.Registration}
     */
    register: function(eventName, callback) {
      if (!this.eventRegistrations.hasOwnProperty(eventName)) {
        this.eventRegistrations[eventName] = [];
      }
      var registrations = new EventBus.Registration(this, eventName, callback);
      this.eventRegistrations[eventName].push(registrations);
      return registrations;
    },
    /**
     *
     * @param {String} eventName
     * @param {Function} callback
     */
    unregister: function(eventName, callback) {
      var registrations = this.eventRegistrations[eventName];
      if (Array.isArray(registrations)) {
        this.eventRegistrations[eventName] = registrations.filter(function( /**EventBus.Registration*/ handler) {
          return handler.callback !== callback;
        });
      }
    },
    dispose: function() {
      this.eventRegistrations = {};
    }
  };

  /**
   *
   * @param {EventBus} eventBus
   * @param {String} eventName
   * @param {Function} callback
   * @constructor
   */
  EventBus.Registration = function(eventBus, eventName, callback) {
    this.eventBus = eventBus;
    this.eventName = eventName;
    this.callback = callback;
  };
  EventBus.Registration.prototype = {
    dispose: function() {
      this.eventBus.unregister(this.eventName, this.callback);
    },
    /**
     * wrapped in try catch to make sure the eventBus trigger continues
     * will dispatch oigError event on eventBus
     * @todo use setTimeout to not block ui on a lot of events handling so that they will be handled async
     * @param {Object} eventDetails
     */
    trigger: function(eventDetails) {
      try {
        this.callback(eventDetails);
      } catch (e) {
      this.eventBus.trigger('oigError', e);
      }
    }
  };

  oig.EventBus = EventBus;

}(oig || (oig = {})));
