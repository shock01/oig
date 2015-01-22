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
     */
    function* eventAttributes(element) {

      var attribute,
        i = 0;

      while ((attribute = element.attributes[i++]) !== undefined) {
        if (attribute.name.substring(0, 2) === 'on') {
          yield attribute.name.substring(0, 2);
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
          for (var /**String*/event of eventAttributes(this)) {
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
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
