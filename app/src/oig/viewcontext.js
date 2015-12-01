'use strict';
var oig;
(function(oig) {
  var hasWindowEvent = true;
  // polyfill window.event for firefox, also use strict cannot use arguments.callee.caller.arguments[0] to get event
  if (!('event' in window)) {
    hasWindowEvent = false;
    var currentEvent,
      keys = Object.keys(window),
      length = keys.length,
      key;

    var eventListener = function( /**Event*/ event) {
      currentEvent = event;
    };

    while (length > 0) {
      key = keys[--length];
      if (key.substring(0, 2) === 'on') {
        window.addEventListener(key.substr(2), eventListener, true);
      }
    }
    Object.defineProperty(window, 'event', {
      get: function() {
        return currentEvent;
      },
      set: function (event) {
        currentEvent = event;
      }
    });
  }
  // polyfill for CustomEvent for PhantomJS and IE
  (function () {
    if (typeof CustomEvent === 'function') { return; }
    function customEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    customEvent.prototype = window.Event.prototype;
    window.CustomEvent = customEvent;
  })();

  function assignViewModelToView(viewModel, view) {
    (function() {
      this.$viewModel = viewModel;
    }).call(view);
  }

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
    * @throws '[oig:viewcontext] no data-oig-viewmodel attribute is set'
    * @returns {viewModel: Object, view: Object}
    */
    init: function(element) {
      if (!this.elementStrategy.isViewModel(element)) {
        throw '[oig:viewcontext] no data-oig-viewmodel attribute is set';
      }
      var context = this.register(element, this.elementStrategy.viewModel(element), this.elementStrategy.view(element)),
        event = new CustomEvent('load', {cancelable: false});
      if(!hasWindowEvent) {
        this.window.event = event;
      }
      element.dispatchEvent(event);
      return context;
    },
    /**
    *
    * @todo make sure we can use promises to resolve viewModels and views so that they can be loaded async
    * @param {Element} element
    * @param {String} viewModelName
    * @param {String?} viewName
    * @returns {viewModel: Object, view: Object}
    */
    register: function(element, viewModelName, viewName) {
      var context,
        map = this.map,
        view, viewModel;

      if (!(context = map.get(element))) {
        // @todo eventBus
        // @todo check if viewModel has method updateView and call it when viewModel changes
        // @todo assing viewModel to the view
        // @todo use a Promise to resolve the viewModel??? what if ViewModel is loaded async???
        // we can use eventBus to notify that a view model was registered (or that anything is registered)
        // then using setTimeout we can garantee....that the other dependencies are also added by the async script
        // then we
        viewModel = this.diContext.resolve(viewModelName);
        view = viewName ? this.diContext.resolve(viewName) : null;
        if (view) {
          assignViewModelToView(viewModel, view);
        }
        context = {
          viewModel: viewModel,
          view: view
        };
        map.set(element, context);
      }
      // @todo eventBus
      return context;
    },
    /**
    * @param Element element
    * @returns {viewModel: Object, view?: Object}}
    */
    resolve: function(element) {
      var context,
        elementStrategy = this.elementStrategy,
        map = this.map,
        /**Element*/ parentElement;
      if (!(context = map.get(element))) {
        if (elementStrategy.isViewModel(element)) {
          context = this.init(element);
        } else {
          parentElement = element;
          while ((parentElement = parentElement.parentElement)) {
            if (elementStrategy.isViewModel(parentElement)) {
              context = this.resolve(parentElement);
              map.set(element, context);
              break;
            }
          }
        }
      }
      // @todo eventBus
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

  oig.ViewContext = ViewContext;

}(oig || (oig = {})));
