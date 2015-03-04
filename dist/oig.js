(function(exports, module){
var oig = {};
var elements = {};
oig.elements = elements;

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
  var appContextViewModels = {};

Object.defineProperty(oig, 'viewModels', {
  get: function () {
    return appContextViewModels;
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
function appContext_buildMethodBody(body) {
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
    // @todo use for-of loop (for key of Object.keys())
    Object.keys(additionalArguments).forEach(function (/**String*/name) {
      args.push(name);
      parameters.push(additionalArguments[name]);
    });
  }

  /*jshint evil: true */
  return new Function(args.join(','), appContext_buildMethodBody(methodBody)).apply(this, parameters);
  /*jshint evil: false */
};



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
function dataContext_resolver(element) {
  var parent = element,
    dataContext;

  if (dataContextMap.has(element)) {
    dataContext = dataContextMap.get(element);
  } else {
    if (element.ownerDocument.contains(element)) {
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

  oig.dataContext = dataContext_resolver;

'use strict';

/**
 *
 * @param {Object} observable
 * @constructor
 */
function ObjectObserver(observable) {

  /**
   * list of observers to notify on change
   * @type {Array<Function>}
   */
  var observers = [];

  /**
   * notifies all observers.
   * no data is passed to the observer because at the time of writing it's not needed (yet)
   */
  function notify() {
    observers.forEach(function (observer) {
      observer();
    });
  }

  /**
   * will push changes to the observers.
   * Object.observe is async but can be 'flushed'
   */
  function notifyAll() {
    Object.deliverChangeRecords(objectCallback);
    Object.deliverChangeRecords(arrayCallback);
  }

  /**
   *
   * @param {Object} observable
   * removes observers
   */
  function unobserve(observable) {
    if (observable === Object(observable)) {
      if (Array.isArray(observable)) {
        Array.unobserve(observable, arrayCallback);
      } else {
        Object.unobserve(observable, objectCallback);
      }
    }
  }

  /**
   * verify changes and calls notify
   * @param {Array.<>} changes
   */
  function objectCallback(changes) {
    changes.forEach(function (change) {
      if (change.type === 'delete') {
        unobserve(change.oldValue);
      } else if (change.type === 'add') {
        deepObserve(change.object[change.name]);
      }
    });
    notify();
  }

  /**
   * verify changes and calls notify
   * @param {Array.<>} changes
   */
  function arrayCallback(changes) {
    changes.forEach(function (change) {
      change.removed.forEach(function (item) {
        unobserve(item);
      });
    });
    notify();
  }

  /**
   *
   * @param {Object} observable
   */
  function deepObserve(observable) {
    if (observable === Object(observable)) {
      if (Array.isArray(observable)) {
        Array.observe(observable, arrayCallback);
        observable.forEach(function (value) {
          deepObserve(value);
        });
      } else {
        Object.observe(observable, objectCallback);
        Object.keys(observable).forEach(function (key) {
          deepObserve(observable[key]);
        });
      }
    }
  }

  /**
   *
   * @param {Function} observer
   */
  function observe(observer) {
    observers.push(observer);
    deepObserve(observable);
  }

  /**
   *
   * @param {Function} observer
   */
  function unObserve(observer) {
    var index;
    if ((index = observers.indexOf(observer)) > -1) {
      observers.splice(index, 1);
      if (typeof observable === 'object' && typeof observer === 'function') {
        try {
          Object.unobserve(observable, observer);
        } catch (e) {
          // make sure that unobserve does not thrown. gracefully
        }
      }
    }
  }

  return {
    observe: observe,
    unObserve: unObserve,
    notifyAll: notifyAll
  };
}

  oig.ObjectObserver = ObjectObserver;

  'use strict';

  /**
   *
 * @type {Object<String, Promise>}
 */
  var resource_requestMap = {};


/**
 * All reource requests should be of http method GET.
 *
 * @param url
 * @returns {{clear: Function, load: Function}}
 */
oig.resource = function (url) {
  return {
    /**
     * removes all loaded resources
     */
    clear: function () {
      resource_requestMap = {};
    },
    /**
     * when no promise is created it will put a new promise in resource_requestMap.
     * @returns {Promise}
     */
    load: function () {
      if (!(url in resource_requestMap)) {
        resource_requestMap[url] = new Promise(function (resolve, reject) {
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
      return resource_requestMap[url];
    }
  };
};

/* global microtemplate:true */
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

/* global microtemplate:false */

'use strict';

/**
 * @see listenerelement.js
 *
 * @param {String} value
 * @returns {boolean}
 */
function elementAttributeTruthy(value) {
  return typeof value === 'string' && (value === 'true' || value === '');
}

/**
 * WeakMap for storing ObjectObservers
 * weak lookup map that can be garbage collected
 */
var elementObserverMap = new WeakMap();

/**
 * observes the datacontext and registers the element in the
 *
 * elementObserverMap
 * @param {Element} element
 */
function element_observeDataContext(element) {
  // watch dataContext changes
  var dataContext = element.dataContext,
    objectObserver,
    observer = element.update.bind(element);

  if (dataContext) {
    objectObserver = new ObjectObserver(dataContext);
    objectObserver.observe(observer);
    elementObserverMap.set(element, {
      objectObserver: objectObserver,
      observer: observer
    });
  } else {
    throw '[oig:element] cannot observer dataContext for element: ' + element;
  }
}

  /**
   *
   * @param {Element} element
   */
  function element_unObserveDataContext(element) {
    var observerContext;
    if (elementObserverMap.has(element)) {
      observerContext = elementObserverMap.get(element);
      observerContext.objectObserver.unObserve(observerContext.observer);
      elementObserverMap.delete(element);
    }
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
   * @type {ObjectObserver}
   */
  objectObserver: {
    value: null,
    writable: true
  },
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
  },
  /**
   * when attached to the DOM and attribute once is not thruthy then
   * add observers
   */
  attachedCallback: {
    value: function () {
      if (!elementAttributeTruthy(this.getAttribute('once'))) {
        element_observeDataContext(this);
      }
    }
  },
  /**
   * clean up nicely to make sure we are not firing observers
   */
  detachedCallback: {
    value: function () {
      element_unObserveDataContext(this);
    }
  },
  /**
   * update methods needs to be implemented by implementations
   * of this prototype
   */
  update: {
    value: function () {
      console.warn('[oig:element] not implemented (update)', this);
    }
  }
});

oig.Element = Element;


'use strict';

/**
 * WeakMap for storing MutationObservers
 * weak lookup map that can be garbage collected
 */
var bindingElementMutationMap = new WeakMap();

/**
 * observes mutation in childList of element
 * and registers the element in the bindingElementMutationMap
 * @param {BindingElement} element
 */
function bindingElementObserveDOM(element) {
  // watch changes of textContent / DOM
  var mutationObserver = new MutationObserver(element.update.bind(element));
  mutationObserver.observe(element, {
    attributes: false,
    childList: true,
    characterData: false
  });
  bindingElementMutationMap.set(element, mutationObserver);
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
      // @todo use a generator method to yield
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
      oig.Element.prototype.attachedCallback.call(this);
      if (!elementAttributeTruthy(this.getAttribute('once'))) {
        bindingElementObserveDOM(this);
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

      oig.Element.prototype.detachedCallback.call(this);

      if (bindingElementMutationMap.has(this)) {
        bindingElementMutationMap.get(this).disconnect();
        bindingElementMutationMap.delete(this);
      }
    }
  },
  /**
   * when an attribute has changed the binding has changed
   * and the view needs to be updated
   */
  attributeChangedCallback: {
    value: function () {
      if (!elementAttributeTruthy(this.getAttribute('once'))) {
        this.update();
      }
    }
  }
};
/**
 * registration
 */
elements.BindingElement = document.registerElement('oig-binding', {
  prototype: Object.create(oig.Element.prototype, BindingElement)
});

'use strict';
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
 * <div is="oig-context" data-view-model="">
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
   * @throws 'required attribute data-view-model is missing'
   */
  attachedCallback: {
    value: function () {
      var viewModel = this.dataset.viewModel,
        dataContext = null;
      if (!viewModel) {
        throw '[oig:contextelement] required attribute data-view-model is missing';
      }
      if (oig.viewModels.hasOwnProperty(viewModel)) {
        dataContext = oig.viewModels[viewModel];
      }
      if (!dataContext) {
        throw '[oig:contextelement] no data context found for:' + viewModel;
      }
      this.dataContext = dataContext;
      this.viewModel = viewModel;
      if (typeof dataContext.onload === 'function') {
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
      if (typeof dataContext.onunload === 'function') {
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

'use strict';

var IfElement = {
  /**
   * when attached to the DOM and attribute once is not thruthy then
   * add observers
   */
  attachedCallback: {
    value: function () {
      oig.Element.prototype.attachedCallback.call(this);
      this.update();
    }
  },
  update: {
    value: function () {
      var test = this.getAttribute('test'),
        flag = oig.evaluate(this.dataContext, test),
        template = this.firstElementChild;

      if (flag) {
        this.insertBefore(this.ownerDocument.importNode(template.content, true), template.nextElementSibling);
      } else {
        while (template.nextSibling) {
          this.removeChild(template.nextSibling);
        }
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
  prototype: Object.create(oig.Element.prototype, IfElement)
});

'use strict';
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
                // @todo simplify this using iterator generator
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

'use strict';


/**
 *
 * Parses all attributes and returns attributes starting with on
 * @param {HTMLElement} element
 */
function* listenerElementEventAttributes(element) {

  var attribute,
    i = 0;

  while ((attribute = element.attributes[i++]) !== undefined) {
    if (attribute.name.substring(0, 2) === 'on') {
      yield attribute.name.substring(2);
    }
  }
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

    if (elementAttributeTruthy(stopPropagationAttr)) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (event.cancelBubble !== null) {
        event.cancelBubble = true;
      }
    }
    if (elementAttributeTruthy(preventDefaultAttr)) {
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
      for (var /**String*/event of listenerElementEventAttributes(this)) {
        addListener(this, event);
      }
    }
  }
};

/**
 * registration
 */
elements.ListenerElement = document.registerElement('oig-listener', {
  prototype: Object.create(oig.Element.prototype, ListenerElement)
});

'use strict';

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
      oig.Element.prototype.attachedCallback.call(this);
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
  prototype: Object.create(oig.Element.prototype, ReactElement)
});

'use strict';

/**
 *
 * will decode html like into a textarea
 *
 * @param {String} html
 * @returns {String}
 */
function templateElementDecodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

var TemplateElement = {
  /**
   */
  attachedCallback: {
    value: function () {

      oig.Element.prototype.attachedCallback.call(this);
      this.update();
    }
  },
  update: {
    value: function () {

      var templateElement = this.firstElementChild,
        nextSibling,
        dataContext = this.dataContext,
        templateEngine,
        template,
        html;
      if (!(templateElement instanceof HTMLTemplateElement)) {
        throw '[oig:templateelement] first element needs to be a template element';
      }

      if (this.dataset.oigTemplateengine) {
        templateEngine = oig.templateEngines[this.dataset.oigTemplateengine];
      } else {
        templateEngine = oig.templateEngines.default;
      }
      if (!templateEngine) {
        throw '[oig:templateelement] no templateengine found';
      }
      template = templateElementDecodeHtml(new XMLSerializer().serializeToString(templateElement.content, 'text/html'));
      html = templateEngine.compile(template, dataContext);

      // remove any previous rendered content
      while ((nextSibling = templateElement.nextSibling) !== null) {
        this.removeChild(templateElement.nextSibling);
      }

      this.insertAdjacentHTML('beforeend', html);
    }
  }
};
/**
 * registration
 */
elements.TemplateElement = document.registerElement('oig-template', {
  prototype: Object.create(oig.Element.prototype, TemplateElement),
  extends: 'div'
});

// Simple JavaScript Templating
// Paul Miller (http://paulmillr.com)
// http://underscorejs.org
// (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
(function(globals) {
  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  var settings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // List of HTML entities for escaping.
  var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  var entityRe = new RegExp('[&<>"\']', 'g');

  var escapeExpr = function(string) {
    if (string == null) return '';
    return ('' + string).replace(entityRe, function(match) {
      return htmlEntities[match];
    });
  };

  var counter = 0;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  var tmpl = function(text, data) {
    var render;

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':escapeExpr(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + "return __p;\n//# sourceURL=/microtemplates/source[" + counter++ + "]";

    try {
      render = new Function(settings.variable || 'obj', 'escapeExpr', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, escapeExpr);
    var template = function(data) {
      return render.call(this, data, escapeExpr);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };
  tmpl.settings = settings;

  if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
      return tmpl;
    }); // RequireJS
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = tmpl; // CommonJS
  } else {
    globals.microtemplate = tmpl; // <script>
  }
})(this);

if (typeof define === 'function' && define.amd) {
  define('oig', [], function () {
    'use strict';
    return oig;
  });
}
if (typeof exports !== 'undefined') {
  exports.oig = oig;
}

})(window);
