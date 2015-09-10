/*exported oigBootstrap */
/**
* @param {Element} element
*/
var oigBootstrap = (function() {

  /**
   * monitor DOM for append /delete
   * traverse the tree and init all items that have a data-oig-viewmodel
   */
  function run(element) {
    parse(element);
    observe(element);
  }

  /**
   * observe dom mutations and call parse or dispose methods
   * @param element
   */
  function observe(element) {
    var observer = createObserver();
    // pass in the target node, as well as the observer options
    observer.observe(element, { attributes: false, childList: true, characterData: false, subtree: true });
  }

  /**
   * create dom mutation observer
   * @returns {MutationObserver}
   */
  function createObserver() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var i = 0,
          node;
        while(node = mutation.removedNodes[i++]) {
          dispose(node);
        }
        i = 0;
        while(node = mutation.addedNodes[i++]) {
          parse(node);
        }
      });
    });
    return observer;
  }

  /**
   * parse elements and initialize them in viewContext
   * @param element
   */
  function parse(element) {
    var viewContext = oig.locator.resolve('oigViewContext');
    var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if(node.hasAttribute('data-oig-viewmodel')) {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    }, false);
    while(treeWalker.nextNode()) {
      viewContext.init(treeWalker.currentNode);
    }
  }

  /**
   * dispose element
   * @param element
   */
  function dispose(element) {
    var viewContext = oig.locator.resolve('oigViewContext');
    var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null, false);
    while(treeWalker.nextNode()) {
      viewContext.dispose(treeWalker.currentNode);
    }
    viewContext.dispose(element);
  }

  return {
    run: run
  };

})();
