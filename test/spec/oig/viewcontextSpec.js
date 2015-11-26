describe('viewContextSpec', function() {
  'use strict';
  var element;
  var viewName;
  var viewContext;
  var diContext;
  var elementStrategy;

  beforeEach(function() {
    elementStrategy = setUpMock(new oig.ElementStrategy());
    diContext = setUpMock(new oig.DIContext());
    viewContext = new oig.ViewContext(diContext, elementStrategy);
  });

  beforeEach(function() {
    viewName = 'test';
    element = document.createElement('div');
    element.setAttribute('id', 'element');
  });

  describe('init', function() {
    it('should throw when element is not valid viewmodel', function() {
      spyOn(elementStrategy, 'isViewModel').and.returnValue(false);
      expect(function() {
        viewContext.init(element);
      }).toThrow('[oig:viewcontext] no data-oig-viewmodel attribute is set');
      expect(elementStrategy.isViewModel).toHaveBeenCalledWith(element);
    });

    describe('when  element is valid', function() {
      var viewModelName = 'viewmodel';
      beforeEach(function() {
        spyOn(elementStrategy, 'isViewModel').and.returnValue(true);
        spyOn(elementStrategy, 'viewModel').and.returnValue(viewModelName);
      });

      beforeEach(function() {
        spyOn(diContext, 'resolve').and.returnValue({});
        viewContext.init(element);
      });

      it('should resolve the viewmodel', function() {
        expect(diContext.resolve).toHaveBeenCalledWith(viewModelName);
      });

      describe('when element is already initialized', function() {
        beforeEach(function() {
          viewContext.init(element);
        });
        it('should not resolve the viewmodel again', function() {
          viewContext.init(element);
          expect(diContext.resolve.calls.count()).toEqual(1);
        });
      });
    });

    describe('when element has view', function() {
      var viewName = 'view';
      beforeEach(function() {
        spyOn(elementStrategy, 'isViewModel').and.returnValue(true);
        spyOn(elementStrategy, 'view').and.returnValue(viewName);
      });

      beforeEach(function() {
        spyOn(diContext, 'resolve').and.returnValue({});
        viewContext.init(element);
      });

      it('should resolve the view', function() {
        expect(diContext.resolve).toHaveBeenCalledWith(viewName);
      });

      describe('when element is already initialized', function() {
        beforeEach(function() {
          viewContext.init(element);
        });
        it('should not resolve the view again', function() {
          viewContext.init(element);
          // call count 2 (viewModel + view)
          expect(diContext.resolve.calls.count()).toEqual(2);
        });
      });
    });
  });

  // @todo, what are we testing here?
  describe('resolve', function() {
    describe('when element is registered', function() {
      beforeEach(function() {
        spyOn(diContext, 'resolve').and.returnValue({});
        viewContext.register(element, 'viewModel', 'view');
      });
      it('should return the context', function() {
        var context = viewContext.resolve(element);
        expect(diContext.resolve).toHaveBeenCalledWith('view');
        expect(diContext.resolve).toHaveBeenCalledWith('viewModel');
        expect(context.view).toBeDefined();
        expect(context.viewModel).toBeDefined();
      });

      describe('when a child element wants to resolve', function() {
        var childElement;
        beforeEach(function() {
          childElement = document.createElement('div');
          childElement.setAttribute('id', 'child');
          element.appendChild(childElement);
          spyOn(elementStrategy, 'isViewModel').and.returnValue(true);
        });
        it('should return the context', function() {
          var context = viewContext.resolve(childElement, 'viewModel', 'view');
          expect(context.viewModel).toBeDefined();
        });
      });
    });
  });
});
