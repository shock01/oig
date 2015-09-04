/*exported OigViewContext */
'use strict';
/**
* @constructor
* @param {OigDIContext} diContext
*/
function OigViewContext(diContext) {
  this.diContext = diContext;
  this.map = new WeakMap();
}

/**
* @param {Element} element
* @returns {Boolean}
*/
function oigIsContextElement(element) {
  return element.hasAttribute(OigAttrs.VIEWMODEL);
}

OigViewContext.prototype = {
  /**
  * @param {Element} element
  * @returns {viewModel: Object, view: Object}
  */
  init: function(element) {
    var /**String*/ viewModelName;
    if (typeof (viewModelName = element.getAttribute(OigAttrs.VIEWMODEL)) !== 'string') {
      throw '[oig:viewcontext] no data-oig-viewmodel attribute is set';
    }
    return this.register(element, viewModelName, element.getAttribute(OigAttrs.VIEW));
  },
  /**
  * @param {Element} element
  * @param {String} viewModelName
  * @param {String?} viewName
  * @returns {viewModel: Object, view: Object}
  */
  register: function(element, viewModelName, viewName) {
    var context,
      map = this.map;

    if (!(context = map.get(element))) {
      // @todo check if viewModel has method updateView and call it when viewModel changes
      // @todo assing viewModel to the view
      context = {
        viewModel: this.diContext.resolve(viewModelName),
        view: viewName ? this.diContext.resolve(viewName) : null
      };
      map.set(element, context);
    }
    return context;
  },
  /**
  * @param Element element
  * @returns {viewModel: Object, view?: Object}}
  */
  resolve: function(element) {
    var context,
      map = this.map,
      /**Element*/ parentElement;
    if (!(context = map.get(element))) {
      if (oigIsContextElement(element)) {
        context = this.init(element);
      } else {
        parentElement = element;
        while ((parentElement = parentElement.parentElement)) {
          if (oigIsContextElement(parentElement)) {
            context = this.resolve(parentElement);
            map.set(element, context);
            break;
          }
        }
      }
    }
    return context;
  },
  /**
  * @param Element element
  */
  dispose: function(element) {
    // @todo dispose observer when element has a view attached
    this.map.delete(element);
  }
};
