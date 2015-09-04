describe('viewContextSpec', function() {
  'use strict';
  var sandbox;
  var /**Element*/ element;
  var /**String*/ viewName;
  var /**OigViewContext*/ viewContext;
  var /**OigDIContext*/ diContext;

  beforeEach(function() {
    diContext = setUpMock(new OigDIContext());
    sandbox = sinon.sandbox.create();
    viewContext = new OigViewContext(diContext);
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(function() {
    viewName = 'test';
    element = document.createElement('div');
    element.setAttribute('id', 'element');
  });

  describe('init', function() {
    it('should throw when no data-oig-viewmodel is set', function() {
      expect(function() {
        viewContext.init(element);
      }).to.throw('[oig:viewcontext] no data-oig-viewmodel attribute is set');
    });

    describe('when data-oig-viewmodel is set', function() {
      var viewModelName = 'viewmodel';
      beforeEach(function() {
        element.setAttribute(OigAttrs.VIEWMODEL, viewModelName);
      });

      beforeEach(function() {
        sandbox.stub(diContext, 'resolve').returns({});
        viewContext.init(element);
      });

      it('should resolve the viewmodel', function() {
        expect(diContext.resolve.calledWith(viewModelName)).to.be.true;
      });

      describe('when element is already initialized', function() {
        beforeEach(function() {
          viewContext.init(element);
        });
        it('should not resolve the viewmodel again', function() {
          viewContext.init(element);
          expect(diContext.resolve.callCount).to.equal(1);
        });
      });
    });

    describe('when data-oig-view is set', function() {
      var viewName = 'view';
      beforeEach(function() {
        element.setAttribute(OigAttrs.VIEWMODEL, 'test');
        element.setAttribute(OigAttrs.VIEW, viewName);
      });

      beforeEach(function() {
        sandbox.stub(diContext, 'resolve').returns({});
        viewContext.init(element);
      });

      it('should resolve the view', function() {
        expect(diContext.resolve.calledWith(viewName)).to.be.true;
      });

      describe('when element is already initialized', function() {
        beforeEach(function() {
          viewContext.init(element);
        });
        it('should not resolve the view again', function() {
          viewContext.init(element);
          // call count 2 (viewModel + view)
          expect(diContext.resolve.callCount).to.equal(2);
        });
      });
    });
  });

  describe('resolve', function() {
    describe('when element is registered', function() {
      beforeEach(function() {
        element.setAttribute(OigAttrs.VIEWMODEL, 'test');
        viewContext.register(element);
      });
      it('should return the context', function() {
        var context = viewContext.resolve(element);
        expect(context.view).to.be.defined;
        expect(context.viewModel).to.be.defined;
      });

      describe('when a child element wants to resolve', function() {
        var childElement;
        beforeEach(function() {
          childElement = document.createElement('div');
          childElement.setAttribute('id', 'child')
          element.appendChild(childElement);
        });
        it('should return the context', function() {
          var context = viewContext.resolve(childElement);
          expect(context.viewModel).to.be.defined;
        });
      });
    });
  });

  describe('dispose', function() {});

});
