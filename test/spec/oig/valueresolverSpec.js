describe('valueResolver', function () {
  'use strict';

  var resolved;

  it('should be defined', function () {
    expect(OigValueResolver).to.be.defined
  });

  describe('add mutable value', function () {
    it('should return value', function () {
      OigValueResolver.register('key', 'thing', true);
      resolved = OigValueResolver.resolve('key');
      expect(resolved).to.equal('thing');
    });

    it('should be possible to change returned value', function () {
      OigValueResolver.register('key', 'newthing', true);
      resolved = OigValueResolver.resolve('key');
      expect(resolved).to.equal('newthing');
    });
  });

  describe('add constant value', function () {
    it('should return value', function () {
      OigValueResolver.register('key', 'thing', false);
      resolved = OigValueResolver.resolve('key');
      expect(resolved).to.equal('thing');
    });

    it('should be not possible to change already registered constant', function () {
      expect(function () {
        resolved = OigValueResolver.register('key', 'newthing', false);
      }).to.throw('[oig:valueresolver] attempt to rewrite value property: key');
      expect(resolved).to.equal('thing');
    });

    it('should not be possible convert constant to mutable', function () {
      expect(function () {
        OigValueResolver.register('key', 'thing', true);
      }).to.throw('[oig:valueresolver] attempt to rewrite value property: key');
    });
  });
})
