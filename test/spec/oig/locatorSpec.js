describe('locator', function() {
  'use strict';

  var locator;
  beforeEach(function() {
    locator = new oig.Locator();
  });

  describe('registering', function() {
    it('should throw when resolver is not a function', function() {
      expect(function() {
        locator.register('test', null);
      }).toThrow('[oig:locator] argument resolver should be function');
    });

    it('should not thrown when registering a function', function() {
      expect(function() {
        locator.register('test', function() {});
      }).not.toThrow();
    });
  });

  describe('resolve', function() {
    var resolveable;
    beforeEach(function() {
      resolveable = {};
      locator.register('test', function() {
        return resolveable;
      });
    });
    it('should throw when not resolvable', function() {
      expect(function() {
        locator.resolve('test2');
      }).toThrow('[oig:locator] unresolvable: test2');
    });
    it('should resolve', function() {
      expect(locator.resolve('test')).toEqual(resolveable);
    });
  });
});
