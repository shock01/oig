'use strict';

function OigValueContext() {
  /**
   * @type {Object<String, OigValueContext.Binding>}
   */
  this.bindings = {};
}

// use scopes as values in Object can be rewritten by defineProperty
OigValueContext.Scopes = {
  CONSTANT: 0,
  VALUE: 1
};

OigValueContext.prototype = {

  /**
   * @param {String} key
   * @returns {Number|String}
   */
  resolve: function (key) {
    return this.bindings[key].value;
  },

  /**
   * @param {String} key
   * @param {String|Number} value
   * @returns {OigValueContext.Binding}
   */
  register: function (key, value) {
    var binding = this.bindings[key];
    if (binding) {
      console.log("THAT: ", binding);
      if (binding.scope === OigValueContext.Scopes.CONSTANT) {
        return binding;
      }
      binding.value = value;
      return binding;
    }
    binding = new OigValueContext.Binding(key, value);
    this.bindings[key] = binding;
    return binding;
  }
};

/**
 * @param {String} key
 * @param {String|Number} value
 * @constructor
 */
OigValueContext.Binding = function (key, value) {
  this.key = key;
  this.value = value;
};

OigValueContext.Binding.prototype = {
  /**
   * default scope of binding
   */
  scope: OigValueContext.Scopes.CONSTANT,
  /**
   * will set scope of value to constant
   */
  asConstant: function () {
    this.scope = OigValueContext.Scopes.CONSTANT;
  },
  /**
   * will set scope of value to value
   */
  asValue: function () {
    this.scope = OigValueContext.Scopes.VALUE;
  }
};
