describe('dicontext', function() {
  'use strict';
  /**
   * @type {OigDIContext}
   */
  var diContext;
  /**
   * @type {OigTypeParser}
   */
  var typeParser;

  var sandbox;


  function Component(dependency) {
    this.dependency = dependency;
  }

  function Injectable() {

  }

  beforeEach(function() {
    typeParser = setUpMock(new OigTypeParser())
    diContext = new OigDIContext(typeParser);
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('bind', function() {
    var binding;
    beforeEach(function() {
      binding = diContext.register('test', Component);
    });
    it('should return a binding', function() {
      assert.equal(binding.name, 'test');
      assert.equal(binding.type, Component);
    });
  });

  describe('resolve', function() {
    var instance,
      dependency,
      binding,
      typeInfo,
      dependencyTypeInfo;

    beforeEach(function() {
      binding = diContext.register('test', Component);
      dependency = new Injectable();
      diContext.register('dependency', Injectable);

      sandbox.stub(typeParser, 'parse', function(type) {
        if (type === Component) {
          return typeInfo;
        } else {
          return dependencyTypeInfo;
        }
      });
      oigLocator.register('dependency', function() {
        return dependency;
      });
    });


    afterEach(function() {
      oigLocator.remove('dependency');
    });

    it('should throw for unknown', function() {
      expect(function() {
        diContext.resolve('unknown');
      }).to.throw('[oig:dicontext] unknown type: unknown');
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
        assert(instance instanceof Component);
      });

      it('as singleton should return same instance', function() {
        binding.asSingleton();
        var instanceA = diContext.resolve('test');
        var instanceB = diContext.resolve('test');
        assert.equal(instanceA, instanceB);
      });

      it('as new it should not return same instance', function() {
        binding.asNew();
        var instanceA = diContext.resolve('test');
        var instanceB = diContext.resolve('test');
        assert.notEqual(instanceA, instanceB);
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
        }).to.throw('[oig:dicontext] instantiate failed to resolve: missing');
      });

      it('should resolve the dependency', function() {
        typeInfo.constructorType.arguments = [{
          name: 'dependency'
        }];
        instance = diContext.resolve('test');
        assert.equal(instance.dependency, dependency);
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
        oigLocator.register('dependency', function() {
          return dependency;
        });
      });

      it('should throw an error', function() {
        expect(function() {
          instance = diContext.resolve('test');
        }).to.throw('[oig:dicontext] circular dependency: test <> dependency');
      });
    });
  });
});
