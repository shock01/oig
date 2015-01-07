var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     * WeakMap for storing ObjectObservers
     * weak lookup map that can be garbage collected
     */
    var observerMap = new WeakMap();

    /**
     * observes the datacontext and registers the element in the
     *
     * @todo remove code duplication between ifelement and bindingelement
     *
     * observerMap
     * @param {IfElement} element
     */
    function observeDataContext(element) {
      // watch dataContext changes
      var observer = element.update.bind(element);
      Object.observe(element.dataContext, observer);
      observerMap.set(element, observer);
    }

    /**
     *
     * @type {HTMLElement}
     * @lends {HTMLElement.prototype}
     */
    var IfElement = Object.create(HTMLElement.prototype, {

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
       * what todo when first is actually already a comment
       * can we prefix the comment with the nodeName
       */
      attachedCallback: {
        value: function () {
          this.update();
          observeDataContext(this);
        }
      },

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
       * clean up nicely to make sure we are not firing observers
       * on non attached DOMElements
       */
      detachedCallback: {
        value: function () {
          var dataContext = this.dataContext;
          if (dataContext) {
            Object.unobserve(dataContext, observerMap.get(this));
          }
          observerMap.delete(this);
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
    });
    /**
     * registration
     */
    elements.IfElement = document.registerElement('oig-if', {
      prototype: IfElement
    });
  })(elements = oig.elements || (oig.elements = {}));
})(oig || (oig = {}));
