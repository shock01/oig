/* global microtemplate:true */
var oig;
(function (oig) {
  /**
   * default template engine used :  https://github.com/paulmillr/microtemplates
   */

  'use strict';

  oig.templateEngines = {};

  var defaultTemplateEngine = {
    /**
     *
     * @param {String} template
     * @param {Object} dataContext
     * @returns {String}
     */
    compile: function (template, dataContext) {
      return microtemplate(template)(dataContext);
    }
  };

  Object.defineProperty(oig.templateEngines, 'default', {
    get: function () {
      return defaultTemplateEngine;
    }
  });

})
(oig || (oig = {}));
/* global microtemplate:false */
