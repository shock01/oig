describe('oigBindable', function () {
  var context,
    bindable,
    sandbox;

  function stubContext(contextName) {
    var context = oigLocator.resolve(contextName);
    sandbox = sinon.sandbox.create();
    sandbox.stub(context, 'register').returns(null);
    sandbox.stub(oigLocator, 'resolve').returns(context);
    sandbox.stub(oigLocator, 'register').returns(null);
    return context;
  }

  beforeEach(function () {
    bindable = new OigBindable('test');
  });

  it('should set key', function () {
    expect(bindable.key).to.be.equal('test');
  });

  describe('diContext', function () {
    var value = {};

    beforeEach(function () {
      context = stubContext('oigDIContext');
      bindable.to(value);
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should resolve DI context', function () {
      expect(oigLocator.resolve.calledWith('oigDIContext')).to.be.true;
    });

    it('should register new value on locator', function () {
      // @todo need also to test second argument
      expect(oigLocator.register.calledWith('test')).to.be.true;
    });

    it('should register new value on context', function () {
      expect(context.register.calledWith('test', value)).to.be.true;
    });
  });

  describe('valueContext', function () {
    var value = 1;
    beforeEach(function () {
      context = stubContext('oigValueContext');
      bindable.to(value);
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should resolve DI context', function () {
      expect(oigLocator.resolve.calledWith('oigValueContext')).to.be.true;
    });

    it('should register new value on locator', function () {
      // @todo need also to test second argument
      expect(oigLocator.register.calledWith('test')).to.be.true;
    });

    it('should register new value on context', function () {
      expect(context.register.calledWith('test', value)).to.be.true;
    });
  });
});
