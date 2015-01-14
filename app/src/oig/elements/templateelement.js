var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {

    /**
     *
     * will decode html like into a textarea
     *
     * @param {String} html
     * @returns {String}
     */
    function decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }

    /**
     *
     * @type {HTMLElement}
     */
    var TemplateElement = {

      dataContext: {
        /**
         * returns the data context of the current element
         * @returns {Object}
         */
        get: function () {
          return oig.dataContext(this);
        }
      },
      /**
       */
      attachedCallback: {
        value: function () {
          var templateElement = this.firstElementChild,
            dataContext = this.dataContext,
            templateEngine,
            template,
            html;
          if(!(templateElement instanceof HTMLTemplateElement)) {
            throw '[oig:templateelement] first element needs to be a template element';
          }

          if(this.dataset.oigTemplateengine) {
            templateEngine = oig.templateEngines[this.dataset.oigTemplateengine];
          } else {
            templateEngine = oig.templateEngines.default;
          }
          if(!templateEngine) {
            throw '[oig:templateelement] no templateengine found';
          }

          // @todo add a method to unescape entities
          template = decodeHtml(templateElement.innerHTML);
          html = templateEngine.compile(template, dataContext);

          this.insertAdjacentHTML('beforeend', html);
        }
      }
    };
    /**
     * registration
     */
    elements.TemplateElement = document.registerElement('oig-template', {
      prototype: Object.create(oig.Element.prototype, TemplateElement),
      extends : 'div'
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start*/(oig || (oig = {})/* jshint ignore:end */);
