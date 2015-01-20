(function () {
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


  /**
   *
   * @param {String }body
   * @returns {string}
   */
  function buildMethodBody(body) {
    return 'try {with(dataContext) { return ' + body + '}} catch(e) {console.error(\'[oig-evaluate error]\', e)}';
  }

  /**
   *
   * executes a method / expression on the viewModel.
   * All properties and methods of the viewModel are accessible as variables.
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
    var args = ['dataContext'],
      parameters = [dataContext];

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

    /*jshint evil: true */
    return new Function(args.join(','), buildMethodBody(methodBody)).apply(this, parameters);
    /*jshint evil: false */
  };

}/* jshint ignore:start */(oig || (oig = {}))/* jshint ignore:end */);


var oig;
(function (oig) {
  'use strict';
  /**
   * weak lookup map that can be garbage collected
   * @type {WeakMap<HTMLElement, Object>}
   */
  var dataContextMap = new WeakMap();

  /**
   *
   * returns the current dataContext for an element by traversing the dom until
   * a oig element is found which will have a data-context attribute.
   * OIG-context element will have a dataContext property which will be added
   * to the dataContextMap for quick reference
   *
   * @param {HTMLElement} element
   * @returns {Object}
   */
  function dataContextResolver(element) {
    var parent = element,
      dataContext;

    if (dataContextMap.has(element)) {
      dataContext = dataContextMap.get(element);
    } else {
      if(element.ownerDocument.contains(element)) {
        do {
          // DOMLevel 4 parentElement used instead of parentNode
          if (parent instanceof oig.elements.ContextElement) {
            dataContext = parent.dataContext;
            dataContextMap.set(element, dataContext);
          }
        } while (!dataContext && parent.parentElement && (parent = parent.parentElement));
      }
    }
    return dataContext;
  }
  oig.dataContext = dataContextResolver;
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);

var oig;
(function (oig) {
  'use strict';

  /**
   * @see listenerelement.js
   *
   * @param {String} value
   * @returns {boolean}
   */
  function attributeTruthy(value) {
    return typeof value === 'string' && (value === 'true' || value === '');
  }

  /**
   * WeakMap for storing ObjectObservers
   * weak lookup map that can be garbage collected
   */
  var observerMap = new WeakMap();

  /**
   * observes the datacontext and registers the element in the
   *
   * observerMap
   * @param {ContextElement} element
   */
  function observeDataContext(element) {
    // watch dataContext changes
    var observer = element.update.bind(element);
    Object.observe(element.dataContext, observer);
    observerMap.set(element, observer);
  }

  /**
   * @class
   * @extends HTMLElement
   * @constructor
   */
  function Element() {
  }

  Element.prototype = Object.create(HTMLElement.prototype, {
    /**
     * returns the data context of the current element
     * @returns {Object}
     */
    dataContext: {
      /**
       * returns the data context of the current element
       * @returns {Object}
       */
      get: function () {
        return oig.dataContext(this);
      }
    }
  });

  /**
   * @class
   * @extends Element
   * @constructor
   */
  function ContextElement() {
  }

  ContextElement.prototype = Object.create(Element.prototype, {
    /**
     * when attached to the DOM and attribute once is not thruthy then
     * add observers
     */
    attachedCallback: {
      value: function () {
        if (!attributeTruthy(this.getAttribute('once'))) {
          observeDataContext(this);
        }
      }
    },
    /**
     * clean up nicely to make sure we are not firing observers
     */
    detachedCallback: {
      value: function () {
        var dataContext = this.dataContext;
        if (observerMap.has(this)) {
          if (dataContext) {
            Object.unobserve(dataContext, observerMap.get(this));
          }
          observerMap.delete(this);
        }
      }
    },
    /**
     * update methods needs to be implemented by implementations
     * of this prototype
     */
    update: {
      value: function () {
        throw '[oig:contextelement] not implemented (update)';
      }
    }
  });

  oig.Element = Element;
  oig.ContextElement = ContextElement;
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);


var oig;

if (typeof define === 'function' && define.amd) {
  define('oig', [], function () {
    'use strict';
    return oig;
  });
}

var oig;
(function (oig) {

  // DUMMY IMPLEMENTATION JUST TO GET IT TO WORK

  'use strict';
  oig.resource = function (url) {
    return {
      load: function () {

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.responseText);
            } else {
              reject(xhr.responseText);
            }
          };
          xhr.send(null);
        });
      }
    };
  };
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);

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

})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
/* global microtemplate:false */

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

var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     *
     * Adds dataContext to HTMLDivElement.
     * HTMLDivElement is the only element that can contain a dataContext because
     * the div element is used to define sections/regions in a html document.
     *
     * CustomEvent contextload
     * will be dispatched before leaving attachedCallback
     * bubbles: false
     * cancellable: false
     *
     * CustomEvent contextunload
     * will be dispatched on entering detachedCallback
     * bubbles: false
     * cancellable: false
     *
     * onload method on viewModel
     * when an onload method is defined on the viewModel the onload will be called
     * before dispatching the viewload event
     *
     * onunload method
     * when an onunload method is defined on the viewModel the onunload will be called
     * before dispatching the viewunload event
     *
     * <div is="oig-context" data-view-models="">
     */
    var ContextElement = Object.create(HTMLDivElement.prototype, {

      dataContext: {
        value: null,
        writable: true
      },
      /**
       * when attached to the DOM will verify that a dataContext
       * can be set based on configured viewModels
       *
       * calls onload when defined on dataContext
       * dispatches contextload event
       *
       * @throws 'required attribute data-view-models is missing'
       */
      attachedCallback: {
        value: function () {
          var viewModel = this.dataset.viewModel,
            dataContext = null;
          if(!viewModel) {
            throw '[oig:contextelement] required attribute data-view-models is missing';
          }
          if (oig.viewModels.hasOwnProperty(viewModel)) {
            dataContext = oig.viewModels[viewModel];
          }
          if (!dataContext) {
            throw '[oig:contextelement] no data context found for:' + viewModel;
          }
          this.dataContext = dataContext;
          this.viewModel = viewModel;
          if(typeof dataContext.onload === 'function') {
            dataContext.onload();
          }
          this.dispatchEvent(new CustomEvent('contextload'));
        }
      },
      /**
       * called when removed from the DOM
       *
       * calls onunload when defined on dataContext
       * dispatches contextunload event
       */
      detachedCallback: {
        value: function () {
          var dataContext = this.dataContext;
          if(typeof dataContext.onunload === 'function') {
            dataContext.onunload();
          }
          this.dispatchEvent(new CustomEvent('contextunload'));
        }
      }
    });
    /**
     * registration
     */
    elements.ContextElement = document.registerElement('oig-context', {
      prototype: ContextElement,
      extends: 'div'
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);

var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {

    var IfElement = {
      /**
       * when attached to the DOM and attribute once is not thruthy then
       * add observers
       */
      attachedCallback: {
        value: function () {
          oig.ContextElement.prototype.attachedCallback.call(this);
          this.update();
        }
      },
      update: {
        value: function () {
          var test = this.getAttribute('test'),
            flag = oig.evaluate(this.dataContext, test),
            template = this.firstElementChild;

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

var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     *
     * Based on http://www.w3.org/TR/xinclude/
     *
     * Attributes
     * <b>href</b>
     *  A value which, after appropriate escaping has been performed, results in a URI reference or an IRI reference specifying the location of the resource to include.
     *  The href attribute is optional; the absence of this attribute is the same as specifying href="", that is, the reference is to the same document.
     *  If the href attribute is absent when parse="xml", the xpointer attribute must be present.
     *  Fragment identifiers must not be used; their appearance is a fatal error.
     *  A value that results in a syntactically invalid URI or IRI should be reported as a fatal error,
     *  but some implementations may find it impractical to distinguish this case from a resource error.
     *
     * <b>xpointer</b>
     *  When parse="xml" or "html", the XPointer contained in the xpointer attribute is evaluated to identify a portion of the resource to include.
     *  This attribute is optional; when omitted, the entire resource is included. The xpointer attribute must not be present when parse="text".
     *  If the xpointer attribute is absent, the href attribute must be present.
     *
     * <b>parse</b>
     *    Indicates whether to include the resource as parsed XML or as text.
     *    The parse attribute allows XInclude to give the author of the including document priority over the server of the included document
     *    in terms of how to process the included content.
     *    A value of "html" indicates that the resource must be parsed as HTML(5)
     *    A value of "xml" indicates that the resource must be parsed as XML and the infosets merged.
     *    value of "text" indicates that the resource must be included as the character information items.
     *    This attribute is optional. When omitted, the value of "html" is implied (even in the absence of a default value declaration).
     *    Values other than "xml", "html" and "text" are a fatal error.
     *
     *
     * Fallback element
     *  The fallback element appears as a child of an include element.
     *  It provides a mechanism for recovering from missing resources.
     *  When a resource error is encountered, the include element is replaced with the contents of the xi:fallback element.
     *  If the fallback element is empty, the include element is removed from the result.
     *  If the fallback element is missing, a resource error results in a fatal error.
     *
     *
     * Include element will be replaced by the contents of the included file
     * If an error occurs the fallback element will be shown
     *
     * Inclusion of SVG content need to make sure to set the namespace on the SVGSVGElement (http://www.w3.org/2000/svg)
     */
    var IncludeElement = Object.create(HTMLDivElement.prototype, {
      /**
       */
      attachedCallback: {
        value: function () {
          var element = this,
            fallback = element.firstElementChild,
            href = this.getAttribute('href'),
            parse = this.getAttribute('parse') || 'html',
            xpointer = this.getAttribute('xpointer'),
            url;

          if ((href === null || href === '') && (xpointer === null || xpointer === '')) {
            throw '[oig:include] both href and xpointer attributes are absent';
          }

          if (typeof parse === 'string' && !(parse === 'text' || parse === 'xml' || parse === 'html')) {
            throw '[oig:include] parse attribute needs to be text or xml';
          }

          if (typeof xpointer === 'string' && parse === 'text') {
            throw '[oig:include] xpointer cannot be used when parse is text';
          }

          url = typeof href === 'string' ? href : this.ownerDocument.documentURI;
          var resource = oig.resource(url);

          resource.load()
            .then(function (text) {
              var /**@type Node*/node,
                /**@type DOMDocument*/doc;
              try {
                if (parse === 'text') {
                  node = element.ownerDocument.createTextNode(text);
                } else {
                  doc = new DOMParser().parseFromString(text, 'text/' + parse);
                  node = element.ownerDocument.importNode(parse === 'html' ? doc.body : doc.documentElement, true);
                  if (xpointer) {
                    var frag = element.ownerDocument.createDocumentFragment(),
                      xPathResult = element.ownerDocument.evaluate(xpointer, node, null, XPathResult.ANY_TYPE, null),
                      found = [],
                      next;
                    while (xPathResult && (next = xPathResult.iterateNext())) {
                      found.push(next);
                    }
                    found.forEach(function (/**Node*/node) {
                      frag.appendChild(element.ownerDocument.importNode(node.cloneNode(true), true));
                    });
                    node = frag;
                  }
                }
                element.parentNode.replaceChild(node, element);
              } catch (e) {
                throw e;
              }
            }).catch(function (/**Error*/error) {
              if (fallback instanceof HTMLTemplateElement) {
                element.parentNode.replaceChild(element.ownerDocument.importNode(fallback.content, true), element);
              } else {
                throw error;
              }
            });
        }
      }
    });
    /**
     * registration
     */
    elements.IncludeElement = document.registerElement('oig-include', {
      prototype: IncludeElement
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);

var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {

    /**
     * @param {String} value
     * @returns {boolean}
     */
    function attributeTruthy(value) {
      return typeof value === 'string' && (value === 'true' || value === '');
    }

    /**
     *
     * Parses all attributes and returns attributes starting with on
     * @param {HTMLElement} element
     * @returns {Array.<Attr>}
     */
    function eventAttributes(element) {
      return Array.prototype.filter.call(element.attributes, function (/**Attr*/attribute) {
        return attribute.name.substring(0, 2) === 'on';
      });
    }

    /**
     * EventListener that will parse attributes on element and execute callback method
     * @param {Event} event
     * @param {ListenerElement} element
     * @this {ListenerElement}
     */
    function eventListener(event, element) {
      var eventTarget = event.target,
        dataContext = element.dataContext,
        preventDefaultAttr = element.getAttribute('prevent-default'),
        stopPropagationAttr = element.getAttribute('stop-propagation'),
        onAttrValue = element.getAttribute('on' + event.type),
        selectorAttrValue = element.getAttribute('selector');

      if (!selectorAttrValue ||
        (eventTarget.webkitMatchesSelector && eventTarget.webkitMatchesSelector(selectorAttrValue)) ||
        (eventTarget.matchesSelector && eventTarget.matchesSelector(selectorAttrValue))) {

        oig.evaluate(dataContext, onAttrValue, {event: event});

        if (attributeTruthy(stopPropagationAttr)) {
          if (event.stopPropagation) {
            event.stopPropagation();
          }
          if (event.cancelBubble !== null) {
            event.cancelBubble = true;
          }
        }
        if (attributeTruthy(preventDefaultAttr)) {
          event.preventDefault();
        }
      }
    }

    /**
     * adds an eventlistener and parses the attribute to determine the click behaviour
     * depends on oig.DataContextProvider to get the current dataContext
     *
     * @param {ListenerElement} element
     * @param {String} eventType
     */
    function addListener(element, eventType) {
      var targetAttrValue = element.getAttribute('target'),
        parentElement = element.parentElement,
        targetElement = (targetAttrValue) ? element.ownerDocument.getElementById(targetAttrValue) : parentElement;

      if (!targetElement) {
        throw 'No event target element found';
      }
      targetElement.addEventListener(eventType, function (event) {
        eventListener(event, element);
      }, false);
    }

    /**
     *
     * <oig-listener onclick>
     * Attributes
     * on<eventType> - required attribute value is parsed and executed on current dataContext, multiple events can be specified on a single element
     * target - optional attribute to specify the domId of the element that should equal the event target
     * prevent-default - optional attribute to prevent default event action
     * stop-progagation - optional attribute to stop propagation of event
     * selector - optional attribute to select sibling of event target on which listener should be invoked
     */
    var ListenerElement = {
      /**
       * when an on attribute is added then add an event listener
       */
      attributeChangedCallback: {
        value: function (/**String*/attrName) {
          if (attrName.substring(0, 2) === 'on') {
            addListener(this, attrName.substring(2));
          }
        }
      },
      /**
       * attach all listeners when added to the dom
       */
      attachedCallback: {
        value: function () {
          var element = this;
          eventAttributes(this).forEach(function (/**Attr*/attribute) {
            addListener(element, attribute.name.substring(2));
          });
        }
      }
    };

    /**
     * registration
     */
    elements.ListenerElement = document.registerElement('oig-listener', {
      prototype: Object.create(oig.Element.prototype, ListenerElement)
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);

var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {

    /**
     * Element to integrate ReactJS Components with dataContext
     * Will be updated when dataContext/viewModel changes
     */
    var ReactElement = {
      /**
       * when attached to the DOM and attribute once is not thruthy then
       * add observers
       */
      attachedCallback: {
        value: function () {
          /*jshint evil: true */
          var jsxComponent = eval(this.getAttribute('component'));
          /*jshint evil: false */
          oig.ContextElement.prototype.attachedCallback.call(this);
          this.reactComponent = React.createElement(jsxComponent, null);
          this.update();
        }
      },
      /**
       * will update the props of the JSX Component and renders it
       * when context attribute is set on element then context will be
       * evaluated on dataContext
       */
      update: {
        value: function () {
          var dataContext = this.dataContext,
            state,
            reactComponent = this.reactComponent,
            context = this.getAttribute('context');

          if (typeof context === 'string' && context.trim().length > 0) {
            state = oig.evaluate(dataContext, context);
          } else {
            state = dataContext;
          }

          React.render(reactComponent, this).setState(state);
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
    elements.ReactElement = document.registerElement('oig-react', {
      prototype: Object.create(oig.ContextElement.prototype, ReactElement)
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);

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
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }

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

}());
