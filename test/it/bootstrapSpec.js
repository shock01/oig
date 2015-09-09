describe("bootsrap", function() {
  'use strict';

  var element,
    viewModel1,
    view1,
    viewContext;

  function bootstrap(element) {
    parse(element);
    observe(element)
  }

  function observe(document) {
    var viewContext = oig.locator.resolve('oigViewContext');
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
    // pass in the target node, as well as the observer options
    observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
  }

  function dispose(element) {
    var viewContext = oig.locator.resolve('oigViewContext');
    var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null, false);
    while(treeWalker.nextNode()) {
      viewContext.dispose(treeWalker.currentNode);
    }
    viewContext.dispose(element);
  }

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

  function attachViewModel1AndView1() {
    function viewModel1() { this.viewModelProp = 123; }
    function view1() { this.viewProp = 123; }
    element = document.createElement('div');
    element.setAttribute('id', 'viewModel1');
    element.setAttribute(OigAttrs.VIEWMODEL, 'viewModel1');
    element.setAttribute(OigAttrs.VIEW, 'view1');
    document.body.appendChild(element);
    oig.bind('viewModel1').to(viewModel1);
    oig.bind('view1').to(view1);
    bootstrap(document.body);
    viewContext = oig.locator.resolve('oigViewContext');
  }

  function attachViewModel1() {
    function viewModel1() { this.viewModelProp = 123; }
    element = document.createElement('div');
    element.setAttribute('id', 'viewModel1');
    element.setAttribute(OigAttrs.VIEWMODEL, 'viewModel1');
    document.body.appendChild(element);
    oig.bind('viewModel1').to(viewModel1);
    bootstrap(document.body);
    viewContext = oig.locator.resolve('oigViewContext');
  }


  describe("add element and attach viewModel", function() {
    beforeEach(function() {
      attachViewModel1();
    });

    it("should add view model to map of viewContext", function() {
      expect(viewContext.resolve(element).viewModel).to.deep.equal({viewModelProp: 123});
    });
  });

  describe("remove element with viewModel", function() {
    beforeEach(function(done) {
      attachViewModel1();
      document.body.removeChild(element);
      setTimeout(done, 0);
    });

    it("should add remove view model from map of viewContext", function() {
      expect(viewContext.map.has(element)).to.be.equal(false);
    });
  });

  describe("add element and attach viewModel and view", function() {
    beforeEach(function() {
      attachViewModel1AndView1();
    });

    it("should add view model to map of viewContext", function() {
      expect(viewContext.resolve(element).viewModel).to.deep.equal({viewModelProp: 123});
    });

    it("should add view model to map of viewContext", function() {
      expect(viewContext.resolve(element).view).to.deep.equal({viewProp: 123});
    });
  });

  describe("remove element with viewModel", function() {
    beforeEach(function(done) {
      attachViewModel1AndView1();
      document.body.removeChild(element);
      setTimeout(done, 0);
    });

    it("should add remove view model from map of viewContext", function() {
      expect(viewContext.map.has(element)).to.be.equal(false);
    });
  });


});
