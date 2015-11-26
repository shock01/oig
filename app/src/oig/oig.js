'use strict';
var oig;
(function(oig) {
  var eventBus = new oig.EventBus(),
    locator = new oig.Locator(),
    typeParser = new oig.TypeParser(),
    diContext = new oig.DIContext(typeParser, locator),
    elementStrategy = new oig.ElementStrategy(),
    viewContext = new oig.ViewContext(diContext, elementStrategy);

  locator
    .register('oigEventBus', function() {
      return eventBus;
    })
    .register('oigTypeParser', function() {
      return typeParser;
    })
    .register('oigDIContext', function() {
      return diContext;
    })
    .register('oigViewContext', function() {
      return viewContext;
    });

  oig.bootstrap = new oig.Bootstrap(viewContext, elementStrategy);
  oig.locator = locator;
  /**
   * expose DIContext bind method on oigFacade
   * @param {String} name
   * @return {*|OigDIContext.Binding|function(this:*)}
   */
  oig.bind = function(name) {
    return {
      to: function(value) {
        locator.register(name, diContext.resolve.bind(diContext, name));
        return diContext.register(name, value);
      }
    };
  };
  return oig;
}(oig || (oig = {})));
