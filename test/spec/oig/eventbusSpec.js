describe('eventBus', function() {
  'use strict';

  /**
   * @type {EventBus}
   */
  var eventBus;

  beforeEach(function() {
    eventBus = new oig.EventBus();
  });

  describe('when registered', function() {
    /**
     * @type {Function}
     */
    var callback;
    /**
     * @type {OigEventBus.Registration}
     */
    var registration;

    beforeEach(function() {
      callback = jasmine.createSpy('callback');
      registration = eventBus.register('test', callback);
    });

    afterEach(function() {
      eventBus.dispose();
    });

    it('should register', function() {
      expect(eventBus.eventRegistrations.test).toBeDefined();
      expect(eventBus.eventRegistrations.test.length).toBe(1);
    });

    describe('when unregistered', function() {
      beforeEach(function() {
        eventBus.unregister('test', callback);
      });
      it('should remove the handler', function() {
        expect(eventBus.eventRegistrations.test.length).toBe(0);
      });
    });

    describe('when disposing', function() {
      beforeEach(function() {
        registration.dispose();
      });
      it('should remove the handler', function() {
        expect(eventBus.eventRegistrations.test.length).toBe(0);
      });
    });

    describe('when event is triggered', function() {
      var eventData;
      /**
       * @type Function
       */
      var callback2;
      /**
       * @type Function
       */
      var callback3;
      beforeEach(function() {
        callback2 = jasmine.createSpy('callback1');
        callback3 = jasmine.createSpy('callback2');
        eventData = {
          key: 'value'
        };
        eventBus.register('test', function() {
          throw 'oeps';
        });
        eventBus.register('test', callback2);
        eventBus.register('oigError', callback3);
        eventBus.trigger('test', eventData);
      });
      it('should call the callback with arguments', function() {
        expect(callback2).toHaveBeenCalledWith(eventData);
      });
      it('should call the error callback', function() {
        expect(callback3).toHaveBeenCalled();
      });
    });
  });
});
