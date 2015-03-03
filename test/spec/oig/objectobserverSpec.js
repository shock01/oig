describe('objectobserver', function () {

  var objectObserver;
  var observer;
  var dataContext = {};
  var nested;

  beforeEach(function () {
    observer = sinon.spy();
    nested = {};
    dataContext = {
      array: [],
      nested: nested
    };
    objectObserver = new ObjectObserver(dataContext);
  });


  it('should call the observer when changing simple property', function () {
    objectObserver.observe(observer);
    dataContext.name = 'test';
    Object.deliverChangeRecords(objectObserver.objectCallback);
    expect(observer.called).to.be.true;
  });

  it('should call the observer when adding nested property', function () {
    objectObserver.observe(observer);
    nested.key = 'test';
    Object.deliverChangeRecords(objectObserver.objectCallback);
    expect(observer.called).to.be.true;
  });

  it('should not call the observer on removing nested property ', function () {
    delete dataContext.nested;
    objectObserver.observe(observer);
    nested.key = 'test';
    Object.deliverChangeRecords(objectObserver.objectCallback);
    expect(observer.called).not.to.be.true;
  });


  it('should call the observer twice after adding and updating nested property', function () {
    objectObserver.observe(observer);
    dataContext.nested2 = {};
    Object.deliverChangeRecords(objectObserver.objectCallback);
    dataContext.nested2.name = 'whatever';
    Object.deliverChangeRecords(objectObserver.objectCallback);
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
      Object.deliverChangeRecords(objectObserver.arrayCallback);
      expect(observer.called).to.be.true;
    });
    it('should call the observer when pushing', function () {
      dataContext.array.push(2);
      Object.deliverChangeRecords(objectObserver.arrayCallback);
      expect(observer.called).to.be.true;
    });
    it('should call the observer when changing array item contents', function () {
      dataContext.array.push(nested);
      Object.deliverChangeRecords(objectObserver.arrayCallback);
      nested.key = 'value';
      Object.deliverChangeRecords(objectObserver.objectCallback);
      expect(observer.callCount).to.equal(2);
    });


    it('should not call the observer on reference removing nested property', function () {
      dataContext.array.push(nested);
      Object.deliverChangeRecords(objectObserver.arrayCallback);
      dataContext.array.length = 0;
      Object.deliverChangeRecords(objectObserver.arrayCallback);
      nested.key = 'test';
      Object.deliverChangeRecords(objectObserver.objectCallback);
      expect(observer.callCount).to.equal(2);
    });
  });


});
