describe('objectobserver', function () {

  'use strict';
  /**
   * @type {ObjectObserver}
   */
  var objectObserver;
  /**
   * @type {Function}
   */
  var observer;
  /**
   * @type {Object}
   */
  var dataContext = {};
  /**
   * @type {Object}
   */
  var nested;

  /**
   * @type {ObserverContext}
   */
  var observerProvider;

  beforeEach(function () {
    observer = sinon.spy();
    nested = {};
    dataContext = {
      array: [],
      nested: nested
    };
    observerProvider = new ObserverContext();
    objectObserver = new ObjectObserver(dataContext, observerProvider);
    objectObserver.canObserve = sinon.stub().returns(true);
  });


  it('should call the observer when changing simple property', function () {
    objectObserver.observe(observer);
    dataContext.name = 'test';
    objectObserver.notifyAll();
    expect(observer.called).to.be.true;
  });

  it('should call the observer when adding nested property', function () {
    objectObserver.observe(observer);
    nested.key = 'test';
    objectObserver.notifyAll();
    expect(observer.called).to.be.true;
  });

  it('should not call the observer on removing nested property ', function () {
    delete dataContext.nested;
    objectObserver.observe(observer);
    nested.key = 'test';
    objectObserver.notifyAll();
    expect(observer.called).not.to.be.true;
  });


  it('should call the observer twice after adding and updating nested property', function () {
    objectObserver.observe(observer);
    dataContext.nested2 = {};
    objectObserver.notifyAll();
    dataContext.nested2.name = 'whatever';
    objectObserver.notifyAll();
    expect(observer.callCount).to.equal(2);
  });

  describe('manipulate array', function () {

    beforeEach(function () {
      objectObserver.observe(observer);
    })

    afterEach(function () {
      objectObserver.unObserve(observer);
    });

    it('should call the observer when changing length', function () {
      dataContext.array.length = 1;
      objectObserver.notifyAll();
      expect(observer.called).to.be.true;
    });

    it('should call the observer when pushing', function () {
      dataContext.array.push(2);
      objectObserver.notifyAll();
      expect(observer.called).to.be.true;
    });

    it('should call the observer when changing array item contents', function () {
      dataContext.array.push(nested);
      objectObserver.notifyAll();
      nested.key = 'value';
      objectObserver.notifyAll();
      expect(observer.callCount).to.equal(2);
    });

    it('should not call the observer on reference removing nested property', function () {
      dataContext.array.push(nested);
      objectObserver.notifyAll();
      dataContext.array.length = 0;
      objectObserver.notifyAll();
      nested.key = 'test';
      objectObserver.notifyAll();
      expect(observer.callCount).to.equal(2);
    });
  });


});
