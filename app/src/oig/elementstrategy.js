'use strict';
var oig;
(function(oig) {

  /**
  * @constructor
  */
  function ElementStrategy() {

  }

  ElementStrategy.prototype = {
    isViewModel: function(element) {
      return element.nodeType === Node.ELEMENT_NODE && element.hasAttribute('data-oig-viewmodel');
    },
    viewModel: function(element) {
      return element.getAttribute('data-oig-viewmodel');
    },
    view: function(element) {
      return element.getAttribute('data-oig-view');
    }
  };
  oig.ElementStrategy = ElementStrategy;
}(oig || (oig = {})));
