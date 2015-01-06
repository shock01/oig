var oig;
(function (oig) {
  'use strict';
  /**
   *
   * @type {Object}
   * container that should have getters for all viewmodels
   * example:
   * oig.viewModels = {
   *  get test() {
   *    cdi/ioc can be done overhere to get constructor arguments etc
   *    return something
   *  }
   * }
   */
  // @todo move me to a better place please
  var viewModels = {};

  Object.defineProperty(oig, 'viewModels', {
    get: function () {
      return viewModels;
    },
    set: function () {
      throw '[oig:appcontext] viewModels property cannot be set directly';
    }
  });
  // @end

  /**
   * @const
   * used for triggering notification on object.getNotifier
   * to notify if a change has occured on the dataContext after
   * executing expression
   */
  var OBJECT_NOTIFIER_EVAL = 'oig-eval-update';
  /**
   *
   * @const
   * name of method used to parse result of expression assignment of variables
   */
  var EVAL_CALLBACK = 'oig_eval';

  /**
   *
   * @param {String }body
   * @returns {string}
   */
  function buildMethodBody(body) {
    return 'try { ' +
      'var result = ' + (body ? body : null ) + ';' +
      EVAL_CALLBACK + '(arguments);' +
      'return result;' +
      '} catch(e) {console.error(\'[oig-evaluate error]\', e)}';
  }

  /**
   *
   * @param dataContext
   * @param {Array.<String>} args
   * @param {Array.<Object>} passedParameters
   * @returns {Function}
   *
   */
  function buildEvaluator(dataContext, args, passedParameters) {

    return function oigEval(/**Array.<Object>*/resultArgs) {

      var notifier = Object.getNotifier(dataContext),
        changes = [],
        parameterValue,
        currentValue,
        value;

      args.forEach(function (/**String*/arg, /**Number*/index) {
        // only assign properties not the methods because that would override viewModel implementations
        if (dataContext.hasOwnProperty(arg) && typeof dataContext[arg] !== 'function') {
          value = resultArgs[index];
          parameterValue = passedParameters[index];
          currentValue = dataContext[arg];
          // first check if argument is changed and verify if argument is different than originalValue on dataContext
          // @todo add deep check for object (JSON.stringify to JSON.stringify, maybe add compare method)
          if (value !== parameterValue && value !== currentValue) {
            changes.push({
              change: arg,
              newValue: value,
              oldValue: currentValue
            });
            notifier.performChange(OBJECT_NOTIFIER_EVAL, function () {
              dataContext[arg] = value;
            });
          }
        }
      });
      // notify changes
      if (changes.length) {
        notifier.notify({
          object: dataContext,
          type: OBJECT_NOTIFIER_EVAL,
          changes: changes
        });
      }
    };
  }

  /**
   *
   * executes a method / expression on the viewModel.
   * All properties and methods of the viewModel are accessible as variables.
   * After executing the method the arguments passed to the executor are evaluated
   * to update the dataContext properties when changed.
   *
   * additionalArguments can be passed like DOMEvent for event listeners
   *
   *
   * @param {Object} dataContext
   * @param {string} methodBody
   * @param {Object=} additionalArguments
   * @returns {*}
   */
  oig.evaluate = function (dataContext, methodBody, additionalArguments) {
    var args = [],
      parameters = [];
    /**
     * add all properties and methods of the dataContext as arguments and parameter values
     * which will be executed and parsed to new function
     */
    if (typeof dataContext === 'object') {
      for (var i in dataContext) {
        args.push(i);
        if(typeof dataContext[i] === 'function') {
          parameters.push(dataContext[i].bind(dataContext));
        } else {
          parameters.push(dataContext[i]);
        }
      }
    }
    /**
     * add any optional arguments to the args and parameters
     * which will be executed and parsed to new function
     */
    if (typeof additionalArguments === 'object') {
      Object.keys(additionalArguments).forEach(function (/**String*/name) {
        args.push(name);
        parameters.push(additionalArguments[name]);
      });
    }
    /**
     * we need to add a callback so that changes are monitored after reassigning properties
     * to the arguments of the expression
     */
    args.push(EVAL_CALLBACK);
    parameters.push(buildEvaluator(dataContext, args, parameters));

    /*jshint evil: true */
    return new Function(args.join(','), buildMethodBody(methodBody)).apply(this, parameters);
    /*jshint evil: false */
  };

}(oig || (oig = {})));
