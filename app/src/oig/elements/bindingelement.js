var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {

    /**
     * @todo make sure it can be reused
     * @see listenerelement.js
     *
     * @param {String} value
     * @returns {boolean}
     */
    function attributeTruthy(value) {
      return typeof value === 'string' && (value === 'true' || value === '');
    }

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
     *
     * Will bind all attributes that do not start with data- to the parentNode
     * or when specified the oig-target
     * <oig-binding data-oig-target="previousSibling|nextSibling"/>
     *
     */
    var BindingElement = {
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
      /**
       * will update attributes
       * In an HTML5 document the attribute has to be accessed with test:foo since namespaces are not supported.
       */
      update: {
        value: function () {
          var targetElement = this.targetElement,
            dataContext = this.dataContext;
          // bind all attributes not starting with data-oig
          for (var i = 0, attribute; (attribute = this.attributes[i++]);) {
            if (attribute.name.substring(0, 8) !== 'data-oig') {
              if (!attribute.namespaceURI) {
                targetElement.setAttribute(attribute.name, oig.evaluate(dataContext, attribute.value));
              } else {
                targetElement.setAttributeNS(attribute.namespaceURI, attribute.name, oig.evaluate(dataContext, attribute.value));
              }
            }
          }
          // update the textContent
          if (typeof this.textContent === 'string') {
            if (!this.shadowRoot) {
              this.createShadowRoot();
            }
            this.shadowRoot.textContent = oig.evaluate(dataContext, this.textContent);
          }
        }
      },

      /**
       * when attached creates a shadowRoot that will contain the evaluated binding
       * as textContent
       * When attribute 'once' is false or absent will add observers to the dataContext and the DOM to update the view
       */
      attachedCallback: {
        value: function () {
          oig.ContextElement.prototype.attachedCallback.call(this);
          if (!attributeTruthy(this.getAttribute('once'))) {
            observeDOM(this);
          }
          this.update();
        }
      },
      /**
       * clean up nicely to make sure we are not firing observers
       * on non attached DOMElements
       */
      detachedCallback: {
        value: function () {

          oig.ContextElement.prototype.detachedCallback.call(this);

          if (mutationObserverMap.has(this)) {
            mutationObserverMap.get(this).disconnect();
            mutationObserverMap.delete(this);
          }
        }
      },
      /**
       * when an attribute has changed the binding has changed
       * and the view needs to be updated
       */
      attributeChangedCallback: {
        value: function () {
          if (!attributeTruthy(this.getAttribute('once'))) {
            this.update();
          }
        }
      }
    };
    /**
     * registration
     */
    elements.BindingElement = document.registerElement('oig-binding', {
      prototype: Object.create(oig.ContextElement.prototype, BindingElement)
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
