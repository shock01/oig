describe('valueResolver', function () {
  'use strict';

  var binding,
    valueContext;

  it('should be defined', function () {
    expect(OigValueContext).to.be.defined
  });

  before(function() {
    valueContext = new OigValueContext();
  });

  describe('register new value', function () {

    beforeEach(function () {
      binding = valueContext.register('key', 'thing');
      valueContext.register('key', 'newthing');
    });

    it('should return OigValueContext.Binding', function () {
      expect(binding).to.be.instanceOf(OigValueContext.Binding);
    });

    it('should not change value', function () {
      expect(valueContext.resolve('key')).to.be.equal('thing');
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
