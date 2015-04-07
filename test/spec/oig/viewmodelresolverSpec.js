describe('viewModelResolver', function () {
  'use strict';

  describe('resolve', function () {
    var resolveable;
    beforeEach(function () {
      resolveable = {};
      oigLocator.register('testViewModel', function () {
        return resolveable;
      });
    });

    it('should throw when not resolvable', function () {
      expect(function () {
        OigViewModelResolver.resolve('test2');
      }).to.throw('[oig:locator] unresolvable: test2');
    });

    it('should resolve', function () {
      expect(OigViewModelResolver.resolve('testViewModel')).to.equal(resolveable);
    });
  });
});
