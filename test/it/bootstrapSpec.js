describe("bootsrap", function() {
  'use strict';

  var element,
    viewModel1,
    view1,
    viewContext;

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
    oig.bootstrap.run(document.body);
    viewContext = oig.locator.resolve('oigViewContext');
  }

  function attachViewModel1() {
    function viewModel1() { this.viewModelProp = 123; }
    element = document.createElement('div');
    element.setAttribute('id', 'viewModel1');
    element.setAttribute(OigAttrs.VIEWMODEL, 'viewModel1');
    document.body.appendChild(element);
    oig.bind('viewModel1').to(viewModel1);
    oig.bootstrap.run(document.body);
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
