'use strict';
var oig;
(function(oig) {
  /**
   * will return an injected instance by name
   * when instance has dependencies then these dependencies will be resolved
   * from oigLocator
   * @throws [oig:dicontext] instantiate failed to resolve: {name}
   */
  function diContextConstructor(
    /**DIContext.Binding*/ binding,
    /**DIContext*/ diContext,
    /**TypeParser*/ typeParser,
    /**Locator*/ locator) /**Object*/ {
    var typeInfo = typeParser.parse(binding.type),
      constructorType = typeInfo.constructorType,
      args = [],
      instance;

    if (Array.isArray(constructorType.arguments)) {
      constructorType.arguments.forEach(function(arg) {
        var dependency,
          dependencyTypeInfo,
          dependencyBinding = diContext.bindings[arg.name];

        if (dependencyBinding && dependencyBinding instanceof DIContext.Binding) {
          dependencyTypeInfo = typeParser.parse(dependencyBinding.type);
          if (dependencyTypeInfo &&
            Array.isArray(dependencyTypeInfo.constructorType.arguments)) {
            dependencyTypeInfo.constructorType.arguments.forEach(function(dependencyArgument) {
              if (dependencyArgument.name === binding.name) {
                // @todo eventBus
                throw '[oig:dicontext] circular dependency: ' + binding.name + ' <> ' + arg.name;
              }
            });
          }
        }
        try {
          dependency = locator.resolve(arg.name);
        } catch (e) {
        // @todo eventBus
        throw '[oig:dicontext] instantiate failed to resolve: ' + arg.name;
        }
        // @todo eventBus
        args.push(dependency);
      });
    }
    // optimize this (jsperf apply vs...)
    instance = Object.create(typeInfo.type.prototype);
    typeInfo.type.apply(instance, args);
    // @todo eventBus
    return instance;
  }

  /**
  * @constructor
  * @param {OigTypeParser} typeParser
  */
  function DIContext(typeParser, locator) {
    this.typeParser = typeParser;
    /**
     * @type {Object<String, DIContext.Binding>}
     */
    this.bindings = {};
    /**
     * @type  {Object<String, Object>}
     */
    this.singletonMap = {};
    /**
    * @type {oig.Locator}
    */
    this.locator = locator;
  }

  DIContext.prototype = {
    /**
     * @param {String} name
     * @param {Function} type
     * @returns {DIContext.Binding}
     */
    register: function(name, type) {
      var binding = new DIContext.Binding(name, type);
      this.bindings[name] = binding;
      // @todo eventBus
      return binding;
    },
    /**
     * @param {String} name
     * @returns {Object}
     * @throws [oig:dicontext] unknown type: {name}
     */
    resolve: function(name) {
      var binding = this.bindings[name],
        singletonMap = this.singletonMap,
        instance;

      if (!(binding && binding instanceof DIContext.Binding)) {
        // @todo eventBus
        throw '[oig:dicontext] unknown type: ' + name;
      }

      if (binding.scope === DIContext.Scopes.SINGLETON) {
        if (singletonMap.hasOwnProperty(name)) {
          instance = singletonMap[name];
        } else {
          instance = diContextConstructor(binding, this, this.typeParser, this.locator);
          singletonMap[name] = instance;
        }
      } else {
        instance = diContextConstructor(binding, this, this.typeParser, this.locator);
      }
      // @todo eventBus
      return instance;
    }
  };

  /**
   * enum for DI context scopes
   */
  DIContext.Scopes = {
    SINGLETON: 0,
    PROTO: 1
  };

  /**
   * @param {String} name
   * @param {Function} type
   * @constructor
   */
  DIContext.Binding = function(name, type) {
    this.name = name;
    /**
     * @type {Function}
     */
    this.type = type;
  };

  DIContext.Binding.prototype = {
    /**
     * default scope of binding
     */
    scope: DIContext.Scopes.PROTO,
    /**
     * will set the bindingScope to PROTO
     * by default bindings will be singleton
     * when setting asNew it will always create a new instance
     * @return {DIContext.Binding}
     */
    asNew: function() {
      this.scope = DIContext.Scopes.PROTO;
      return this;
    },
    /**
     * will set the bindingScope to SINGLETON
     * @return {DIContext.Binding}
     */
    asSingleton: function() {
      this.scope = DIContext.Scopes.SINGLETON;
      return this;
    }
  };
  oig.DIContext = DIContext;
}(oig || (oig = {})));
