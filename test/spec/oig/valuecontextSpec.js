describe('valueResolver', function () {
  'use strict';

  var resolved,
    binding,
    valueContext;

  it('should be defined', function () {
    expect(OigValueContext).to.be.defined
  });

  before(function() {
    valueContext = new OigValueContext();
  });

  //describe('add mutable value', function () {
  //  it('should return value', function () {
  //    valueContext.register('key', 'thing', true);
  //    resolved = valueContext.resolve('key');
  //    expect(resolved).to.equal('thing');
  //  });
  //
  //  it('should be possible to change returned value', function () {
  //    valueContext.register('key', 'newthing', true);
  //    resolved = valueContext.resolve('key');
  //    expect(resolved).to.equal('newthing');
  //  });
  //});
  //
  //describe('add constant value', function () {
  //  it('should return value', function () {
  //    valueContext.register('key', 'thing', false);
  //    resolved = valueContext.resolve('key');
  //    expect(resolved).to.equal('thing');
  //  });
  //
  //  it('should be not possible to change already registered constant', function () {
  //    expect(resolved).to.equal('thing');
  //  });
  //});

  describe('register new value', function () {

    beforeEach(function () {
      binding = valueContext.register('key', 'thing');
    });

    it('should return OigValueContext.Binding', function () {
      expect(binding).to.be.instanceOf(OigValueContext.Binding);
    });

  });

  describe('register constant', function () {
    beforeEach(function () {
      binding = valueContext.register('key', 'thing');
      binding.asConstant();
      valueContext.register('key', 'newthing');
    });

    it('should not change value', function () {
      expect(valueContext.resolve('key')).to.be.equal('thing');
    });
  });

  describe('register value', function () {
    beforeEach(function () {
      binding = valueContext.register('key', 'thing');
      binding.asValue();
      valueContext.register('key', 'newthing');
    });

    it('should not change value', function () {
      expect(valueContext.resolve('key')).to.be.equal('newthing');
    });
  });
});
