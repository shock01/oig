var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     * @lends {HTMLElement.prototype}
     */
    var IfElement = {
      update: {
        value: function () {
          var test = this.getAttribute('test'),
            flag = oig.evaluate(this.dataContext, test),
            template = this.querySelector('template');

          if (flag) {
            this.insertAdjacentHTML('afterBegin', template.innerHTML);
          } else {
            this.innerHTML = template.outerHTML;
          }
        }
      },
      /**
       * when the test attribute changes make sure to update only when element
       * is attached to the document
       */
      attributeChangedCallback: {
        value: function (/**String*/attrName) {
          if (this.ownerDocument.contains(this) && attrName === 'test') {
            this.update();
          }
        }
      }
    };
    /**
     * registration
     */
    elements.IfElement = document.registerElement('oig-if', {
      prototype: Object.create(oig.ContextElement.prototype, IfElement)
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
