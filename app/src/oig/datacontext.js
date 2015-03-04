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
