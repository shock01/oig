describe('locator', function () {
  'use strict';

  describe('registering', function () {
    it('should throw when resolver is not  afunction', function () {
      expect(function () {
        oigLocator.register('test', null);
      }).to.throw('[oig:locator] argument resolver should be function');
    });

    it('should not thrown when registering a function', function () {
      expect(function () {
        oigLocator.register('test', function () {
        });
      }).not.to.throw;
    });
  });

  describe('resolve', function () {
    var resolveable;
    beforeEach(function () {
      resolveable = {};
      oigLocator.register('test', function () {
        return resolveable;
      });
    });
    it('should throw when not resolvable', function () {
      expect(function () {
        oigLocator.resolve('test2');
      }).to.throw('[oig:locator] unresolvable: test2');
    });
    it('should resolve', function () {
      expect(oigLocator.resolve('test')).to.equal(resolveable);
    });
  });

});
