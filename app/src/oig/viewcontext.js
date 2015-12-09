'use strict';
var oig;
(function(oig) {

  /**
  * @constructor
  * @param {oig.DIContext} diContext
  * @param {Window} window
  * @param {oig.ElementStrategy} elementStrategy
  */
  function ViewContext(diContext, window, elementStrategy) {
    this.diContext = diContext;
    this.window = window;
    this.elementStrategy = elementStrategy;
    this.map = new WeakMap();
  }

  ViewContext.prototype = {
    /**
    * @param {Element} element
    * @throws '[oig:viewcontext] no data-oig-view attribute is set'
    * @returns {Object} view
    */
    init: function(element) {
      if (!this.elementStrategy.isView(element)) {
        throw '[oig:viewcontext] no data-oig-view attribute is set';
      }
      var view = this.register(element, this.elementStrategy.view(element)),
        event = new CustomEvent('load', {cancelable: false});
      // in IE window.event is readonly and will fail using use-strict
      try {
        this.window.event = event;
      } catch (e) {}
      element.dispatchEvent(event);
      return view;
    },
    /**
    *
    * @todo make sure we can use promises to resolve viewModels and views so that they can be loaded async
    * @param {Element} element
    * @param {String} viewModelName
    * @param {String?} viewName
    * @returns {Object} view
    */
    register: function(element, viewName) {
      var map = this.map,
        view = map.get(element),
        provider = {};

      if (!view) {
        // @todo eventBus
        // @todo check if viewModel has method updateView and call it when viewModel changes
        // @todo assing viewModel to the view
        // @todo use a Promise to resolve the viewModel??? what if ViewModel is loaded async???
        // we can use eventBus to notify that a view model was registered (or that anything is registered)
        // then using setTimeout we can garantee....that the other dependencies are also added by the async script
        // then we
        provider.element = function() {
          return element;
        };
        view = viewName ? this.diContext.resolve(viewName, provider) : null;
        map.set(element, view);
      }
      // @todo eventBus
      return view;
    },
    /**
    * @param Element element
    * @returns {Object} view
    */
    resolve: function(element) {
      var elementStrategy = this.elementStrategy,
        map = this.map,
        /**Element*/ parentElement,
        view = map.get(element);
      if (!view) {
        if (elementStrategy.isView(element)) {
          view = this.init(element);
        } else {
          parentElement = element;
          while ((parentElement = parentElement.parentElement)) {
            if (elementStrategy.isView(parentElement)) {
              view = this.resolve(parentElement);
              map.set(element, view);
              break;
            }
          }
        }
      }
      // @todo eventBus
      return view;
    },
    /**
    * @param Element element
    */
    dispose: function(element) {
      // @todo dispose observer when element has a view attached
      this.map.delete(element);
    }
  };

  oig.ViewContext = ViewContext;

}(oig || (oig = {})));
