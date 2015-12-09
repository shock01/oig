describe('dicontext', function() {
  'use strict';

  var diContext;
  var typeParser;
  var locator;

  function Component(dependency) {
    this.dependency = dependency;
  }

  function Injectable() {

  }

  beforeEach(function() {
    typeParser = setUpMock(new oig.TypeParser());
    locator = setUpMock(new oig.Locator());
    diContext = new oig.DIContext(typeParser, locator);
  });

  describe('bind', function() {
    var binding;
    beforeEach(function() {
      binding = diContext.register('test', Component);
    });
    it('should return a binding', function() {
      expect(binding.name).toEqual('test');
      expect(binding.type).toEqual(Component);
    });
  });

  describe('resolve method', function() {
    var binding,
      method;
    beforeEach(function() {
      method = jasmine.createSpy('instance');
      binding = diContext.register('test', method);
      spyOn(typeParser, 'parse').and.returnValue({
        arguments: [{
          name: 'dependency'
        }]
      });
    });

    beforeEach(function() {
      diContext.resolve('test');
    });
    it('should have called the typeparser', function() {
      expect(typeParser.parse).toHaveBeenCalledWith(method);
    });
  });

  describe('resolve instance', function() {
    var instance,
      dependency,
      binding,
      typeInfo,
      dependencyTypeInfo;

    beforeEach(function() {
      binding = diContext.register('test', Component);
      dependency = new Injectable();
      diContext.register('dependency', Injectable);
      spyOn(typeParser, 'parse').and.callFake(function(type) {
        if (type === Component) {
          return typeInfo;
        } else {
          return dependencyTypeInfo;
        }
      });
      // @todo this can be better
      spyOn(locator, 'resolve').and.callFake(function(name) {
        if (name === 'missing') {
          throw '[oig:locator] unresolvable: ' + name;
        }
        if (name === 'dependency') {
          return dependency;
        } else {
          return {};
        }
      });
    });

    it('should throw for unknown', function() {
      expect(function() {
        diContext.resolve('unknown');
      }).toThrow('[oig:dicontext] unknown type: unknown');
    });

    describe('without dependencies', function() {
      beforeEach(function() {
        typeInfo = {
          type: Component,
          constructorType: {
            arguments: []
          }
        };
      });

      it('should return an instance', function() {
        instance = diContext.resolve('test');
        expect(instance instanceof Component).toBe(true);
      });

      it('as singleton should return same instance', function() {
        binding.asSingleton();
        var instanceA = diContext.resolve('test');
        var instanceB = diContext.resolve('test');
        expect(instanceA).toBe(instanceB);
      });

      it('as new it should not return same instance', function() {
        binding.asNew();
        var instanceA = diContext.resolve('test');
        var instanceB = diContext.resolve('test');
        expect(instanceA).not.toBe(instanceB);
      });
    });

    describe('with dependencies', function() {
      beforeEach(function() {
        typeInfo = {
          type: Component,
          constructorType: {
            arguments: []
          }
        };
      });

      it('should throw exception on missing dependency', function() {
        typeInfo.constructorType.arguments = [{
          name: 'missing'
        }];
        expect(function() {
          diContext.resolve('test');
        }).toThrow('[oig:dicontext] instantiate failed to resolve: missing');
      });

      it('should resolve the dependency', function() {
        typeInfo.constructorType.arguments = [{
          name: 'dependency'
        }];
        instance = diContext.resolve('test');
        expect(instance.dependency).toBe(dependency);
      });
    });

    describe('with provider', function () {
      var providerDependency = { provider: true};
      beforeEach(function() {
        typeInfo = {
          type: Component,
          constructorType: {
            arguments: [{name: 'newDependency'}]
          }
        };
      });

      it('should throw error if dependency in provider is not a function', function() {
        expect(function() {
          diContext.resolve('test', {'newDependency': providerDependency})
        }).toThrow('[oig:dicontext] dependency in provider should callable: newDependency');
      });

      it('should resolve the dependency provided by provider', function() {
        instance = diContext.resolve('test', {'newDependency': function() { return providerDependency}});
        expect(instance.dependency).toEqual(providerDependency);
      });
    });

    describe('with circular dependency', function() {

      beforeEach(function() {
        typeInfo = {
          type: Component,
          constructorType: {
            arguments: [{
              name: 'dependency'
            }]
          }
        };
        dependencyTypeInfo = {
          type: Injectable,
          constructorType: {
            arguments: [{
              name: 'test'
            }]
          }
        };
        locator.register('dependency', function() {
          return dependency;
        });
      });

      it('should throw an error', function() {
        expect(function() {
          instance = diContext.resolve('test');
        }).toThrow('[oig:dicontext] circular dependency: test <> dependency');
      });
    });
  });
});
