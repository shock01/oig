var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     * WeakMap for storing MutationObservers
     * weak lookup map that can be garbage collected
     */
    var mutationObserverMap = new WeakMap();

    /**
     * observes mutation in childList of element
     * and registers the element in the mutationObserverMap
     * @param {BindingElement} element
     */
    function observeDOM(element) {
      // watch changes of textContent / DOM
      var mutationObserver = new MutationObserver(element.update.bind(element));
      mutationObserver.observe(element, {
        attributes: false,
        childList: true,
        characterData: false
      });
      mutationObserverMap.set(element, mutationObserver);
    }

    /**
     * WeakMap for storing ObjectObservers
     * weak lookup map that can be garbage collected
     */
    var observerMap = new WeakMap();

    /**
     * observes the datacontext and registers the element in the
     * observerMap
     * @param {BindingElement} element
     */
    function observeDataContext(element) {
      // watch dataContext changes
      var observer = element.update.bind(element);
      Object.observe(element.dataContext, observer);
      observerMap.set(element, observer);
    }

    /**
     *
     * Will bind all attributes that do not start with data- to the parentNode
     * or when specified the oig-target
     * <oig-binding data-oig-target="previousSibling|nextSibling"/>
     *
     * @type {HTMLElement}
     * @lends {HTMLScriptElement.prototype}
     */
    var BindingElement = Object.create(HTMLScriptElement.prototype, {

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
       * returns the binding target element set as data-oig-target
       * possible values: nextSibling, previousSibling
       * Will use the first Node.ELEMENT_NODE based on target provided
       *
       */
      targetElement: {
        get: function () {
          // DOM Level 4 parentElement used instead of parentNode
          var oigTarget = this.dataset.oigTarget,
            targetElement = this.parentElement;

          if (oigTarget === 'nextSibling' || oigTarget === 'previousSibling') {
            targetElement = this[oigTarget];
            // @todo use nextElementSibling and previousElementSibling
            while (targetElement.nodeType !== Node.ELEMENT_NODE) {
              targetElement = targetElement[oigTarget];
            }
          }

          return targetElement;
        }
      },

      update: {
        value: function () {
          var targetElement = this.targetElement,
            dataContext = this.dataContext;

          // bind all attributes not starting with data-oig
          for (var i = 0, attribute; (attribute = this.attributes[i++]);) {
            if (attribute.name.substring(0, 8) !== 'data-oig') {
              targetElement.setAttribute(attribute.name, oig.evaluate(dataContext, attribute.value));
            }
          }
          // update the textContent
          if (typeof this.textContent === 'string') {
            this.shadowRoot.textContent = oig.evaluate(dataContext, this.textContent);
          }
        }
      },

      /**
       * when attached creates a shadowRoot that will contain the evaluated binding
       * as textContent
       * Will add observers to the dataContext and the DOM to update the view
       */
      attachedCallback: {
        value: function () {
          this.createShadowRoot();
          this.update();

          observeDataContext(this);
          observeDOM(this);
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

          mutationObserverMap.get(this).disconnect();
          mutationObserverMap.delete(this);
        }
      },
      /**
       * when an attribute has changed the binding has changed
       * and the view needs to be updated
       */
      attributeChangedCallback: {
        value: function () {
          this.update();
        }
      }
    });
    /**
     * registration
     */
    elements.BindingElement = document.registerElement('oig-binding', {
      prototype: BindingElement
    });
  })(elements = oig.elements || (oig.elements = {}));
})(oig || (oig = {}));
