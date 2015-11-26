'use strict';
var oig;
(function(oig) {

  function Bootstrap( /**OigViewContext*/ viewContext, elementStrategy) {

    function parse( /**Element*/ element) {
      if (element.nodeType !== Node.ELEMENT_NODE) {
        throw '[oigBootstrap::parse] invalid nodetype: expected: ' + Node.ELEMENT_NODE + ' got:' + element.nodeType;
      }
      if (elementStrategy.isViewModel(element)) {
        viewContext.init(element);
      }
      var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function(node) {
          return elementStrategy.isViewModel(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }, false);
      while (treeWalker.nextNode()) {
        viewContext.init(treeWalker.currentNode);
      }
    }

    function dispose( /**Element*/ element) {
      var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null, false);
      while (treeWalker.nextNode()) {
        viewContext.dispose(treeWalker.currentNode);
      }
      viewContext.dispose(element);
    }

    function observe( /**Element*/ element) {
      (new MutationObserver(function(mutations) {
        var i = 0,
          j = 0,
          k = 0,
          len = mutations.length,
          mutation,
          node;
        for (i; i < len; i++) {
          mutation = mutations[i];
          while ((node = mutation.removedNodes[j++])) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              dispose(node);
            }
          }
          while ((node = mutation.addedNodes[k++])) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              parse(node);
            }
          }
        }
      })).observe(element, {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: true
      });
    }

    return {
      run: function(element) {
        parse(element);
        observe(element);
      }
    };
  }

  oig.Bootstrap = Bootstrap;
}(oig || (oig = {})));
