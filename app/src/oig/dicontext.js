'use strict';

/**
 * will return an injected instance by name
 * when instance has dependencies then these dependencies will be resolved
 * from oigLocator
 * @param {OigDIContext.Binding} binding
 * @param {OigDIContext} diContext
 * @throws [oig:dicontext] instantiate failed to resolve: {name}
 * @returns {Object}
 */
function oigDIContextConstructor(binding, diContext) {
  var typeParser = oigLocator.resolve('oigTypeParser'),
    typeInfo = typeParser.parse(binding.type),
    constructorType = typeInfo.constructorType,
    args = [],
    instance = Object.create(typeInfo.type.prototype);
  if (Array.isArray(constructorType.arguments)) {
    constructorType.arguments.forEach(function (arg) {
      var dependency,
        dependencyTypeInfo,
        dependencyBinding = diContext.bindings[arg.name];

      if (dependencyBinding && dependencyBinding instanceof OigDIContext.Binding) {
        dependencyTypeInfo = typeParser.parse(dependencyBinding.type);
        if (dependencyTypeInfo &&
          Array.isArray(dependencyTypeInfo.constructorType.arguments)) {
          dependencyTypeInfo.constructorType.arguments.forEach(function (dependencyArgument) {
            if (dependencyArgument.name === binding.name) {
              throw '[oig:dicontext] circular dependency: ' + binding.name + ' <> ' + arg.name;
            }
          });
        }
      }
      try {
        dependency = oigLocator.resolve(arg.name);
      } catch (e) {
        throw '[oig:dicontext] instantiate failed to resolve: ' + arg.name;
      }
      args.push(dependency);
    });
  }

  typeInfo.type.apply(instance, args);
  return instance;
}

function OigDIContext() {
  /**
   *
   * @type {Object<String, OigDIContext.Binding>}
   */
  this.bindings = {};
  /**
   * @type  {Object<String, Object>}
   */
  this.singletonMap = {};
}

OigDIContext.prototype = {
  /**
   * @param {String} name
   * @returns {OigDIContext.Binding}
   */
  bind: function (name) {
    var binding = new OigDIContext.Binding(name);
    this.bindings[name] = binding;
    return binding;
  },
  /**
   * @param {String} name
   * @returns {Object}
   * @throws [oig:dicontext] unknown type: {name}
   */
  resolve: function (name) {
    var binding = this.bindings[name],
      singletonMap = this.singletonMap,
      instance;

    if (!(binding && binding instanceof OigDIContext.Binding)) {
      throw '[oig:dicontext] unknown type: ' + name;
    }

    if (binding.scope === OigDIContext.Scopes.SINGLETON) {
      if (singletonMap.hasOwnProperty(name)) {
        instance = singletonMap[name];
      } else {
        instance = oigDIContextConstructor(binding, this);
        singletonMap[name] = instance;
      }
    } else {
      instance = oigDIContextConstructor(binding, this);
    }
    return instance;
  }
};

/**
 * enum for DI context scopes
 */
OigDIContext.Scopes = {
  SINGLETON: 0,
  PROTO: 1
};

/**
 * @param {String} name
 * @constructor
 */
OigDIContext.Binding = function (name) {
  this.name = name;
  /**
   * @type {Function}
   */
  this.type = null;
};

OigDIContext.Binding.prototype = {
  /**
   * default scope of binding
   */
  scope: OigDIContext.Scopes.SINGLETON,
  /**
   * will set the bindingScope to PROTO
   * by default bindings will be singleton
   * when setting asNew it will always create a new instance
   * @return {OigDIContext.Binding}
   */
  asNew: function () {
    this.scope = OigDIContext.Scopes.PROTO;
    return this;
  },
  /**
   * will set the bindingScope to SINGLETON
   * @return {OigDIContext.Binding}
   */
  asSingleton: function () {
    this.scope = OigDIContext.Scopes.SINGLETON;
    return this;
  },
  /**
   * @param {Function} type
   * @return {OigDIContext.Binding}
   */
  to: function (type) {
    this.type = type;
    return this;
  }
};
