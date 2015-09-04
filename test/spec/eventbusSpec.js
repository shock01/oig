describe('eventBus', function () {
  'use strict';

  /**
   * @type {OigEventBus}
   */
  var eventBus;

  beforeEach(function () {
    eventBus = new OigEventBus();
  });

  it('should be defined', function () {
    assert.isDefined(eventBus);
  });

  describe('when registered', function () {
    /**
     * @type {Function}
     */
    var callback;
    /**
     * @type {OigEventBus.Registration}
     */
    var registration;

    beforeEach(function () {
      callback = sinon.spy();
      registration = eventBus.register('test', callback);
    });

    afterEach(function () {
      eventBus.dispose();
    });

    it('should register', function () {
      assert.isDefined(eventBus.eventRegistrations.test);
      assert.equal(eventBus.eventRegistrations.test.length, 1);
    });

    describe('when unregistered', function () {
      beforeEach(function () {
        eventBus.unregister('test', callback);
      });
      it('should remove the handler', function () {
        assert.equal(eventBus.eventRegistrations.test.length, 0);
      });
    });

    describe('when disposing', function () {
      beforeEach(function () {
        registration.dispose();
      });
      it('should remove the handler', function () {
        assert.equal(eventBus.eventRegistrations.test.length, 0);
      });
    });

    describe('when event is triggered', function () {
      var eventData;
      /**
       * @type Function
       */
      var callback2;
      /**
       * @type Function
       */
      var callback3;
      beforeEach(function () {
        callback2 = sinon.spy();
        callback3 = sinon.spy();
        eventData = {key: 'value'};
        eventBus.register('test', function () {
          throw 'oeps';
        });
        eventBus.register('test', callback2);
        eventBus.register('oigError', callback3);
        eventBus.trigger('test', eventData);
      });
      it('should call the callback with arguments', function () {
        assert(callback2.calledWith(eventData));
      });
      it('should call the error callback', function () {
        assert(callback3.called);
      });
    });
  });
});
