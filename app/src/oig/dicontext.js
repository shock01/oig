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
    /**Locator*/ locator,
    /**Object*/ provider) /**Object*/ {
    var typeInfo = typeParser.parse(binding.type),
      constructorType = typeInfo.constructorType ? typeInfo.constructorType : binding.type,
      dependencies = constructorType.arguments,
      args = [],
      instance;

    if (Array.isArray(dependencies)) {
      dependencies.forEach(function(arg) {
        var dependencyName = arg.name,
          dependency,
          dependencyTypeInfo,
          dependencyProvider,
          dependencyBinding = diContext.bindings[dependencyName];

        if (provider && provider[dependencyName]) {
          dependencyProvider = provider[dependencyName];
          if (typeof(dependencyProvider) !== 'function') {
            throw '[oig:dicontext] dependency in provider should callable: ' + dependencyName;
          }
          dependency = dependencyProvider();
        } else {
          if (dependencyBinding && dependencyBinding instanceof DIContext.Binding) {
            dependencyTypeInfo = typeParser.parse(dependencyBinding.type);
            // @todo not fixing this now. There's another issue opened that will resolve circular dependencies
            if (dependencyTypeInfo &&
              dependencyTypeInfo.constructorType &&
              Array.isArray(dependencyTypeInfo.constructorType.arguments)) {
              dependencyTypeInfo.constructorType.arguments.forEach(function(dependencyArgument) {
                if (dependencyArgument.name === binding.name) {
                  // @todo eventBus
                  throw '[oig:dicontext] circular dependency: ' + binding.name + ' <> ' + dependencyName;
                }
              });
            }
          }
          try {
            dependency = locator.resolve(dependencyName);
          } catch (e) {
            // @todo eventBus
            throw '[oig:dicontext] instantiate failed to resolve: ' + dependencyName;
          }
        }
        // @todo eventBus
        args.push(dependency);
      });
    }
    if (typeInfo.type) {
      instance = Object.create(typeInfo.type.prototype);
      typeInfo.type.apply(instance, args);
    } else {
      instance = constructorType.apply(null, args);
    }
    // @todo eventBus
    return instance;
  }

  /**
  * @constructor
  * @param {oig.TypeParser} typeParser
  * @param {oig.Locator} locator
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
    resolve: function(name, provider) {
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
          instance = diContextConstructor(binding, this, this.typeParser, this.locator, provider);
          singletonMap[name] = instance;
        }
      } else {
        instance = diContextConstructor(binding, this, this.typeParser, this.locator, provider);
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
