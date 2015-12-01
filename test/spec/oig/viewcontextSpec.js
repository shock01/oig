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
    viewContext = new oig.ViewContext(diContext, window, elementStrategy);
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

    describe('when element is valid', function() {
      var viewModelName = 'viewmodel';
      beforeEach(function() {
        spyOn(elementStrategy, 'isViewModel').and.returnValue(true);
        spyOn(elementStrategy, 'viewModel').and.returnValue(viewModelName);
        spyOn(element, 'dispatchEvent');
      });

      beforeEach(function() {
        spyOn(diContext, 'resolve').and.returnValue({});
        viewContext.init(element);
      });

      afterEach(function () {
        viewContext.dispose(element);
      });

      it('should resolve the viewmodel', function() {
        expect(diContext.resolve).toHaveBeenCalledWith(viewModelName);
      });

      it('should have called the dispatchEvent', function () {
        var event = element.dispatchEvent.calls.argsFor(0)[0];
        expect(event.type).toEqual('load');
        expect(event instanceof CustomEvent).toBe(true);
      });

      describe('when element is already initialized', function() {
        beforeEach(function() {
          viewContext.init(element);
        });
        afterEach(function () {
          viewContext.dispose(element);
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
  describe('when register element', function() {
    var view = {
        'view': true
      },
      viewModel = {
        'viewModel': true
      };

    describe('when element is registered', function() {
      beforeEach(function() {
        spyOn(diContext, 'resolve').and.callFake(function(name) {
          return name === 'viewModel' ? viewModel : view;
        });
        viewContext.register(element, 'viewModel', 'view');
      });
      it('should return the context', function() {
        var context = viewContext.resolve(element);
        expect(diContext.resolve).toHaveBeenCalledWith('view');
        expect(diContext.resolve).toHaveBeenCalledWith('viewModel');
        expect(context.view).toBe(view);
        expect(context.viewModel).toBe(viewModel);
        expect(view.$viewModel).toBe(viewModel);
      });

      describe('when a child element wants to resolve', function() {
        var childElement,
          strategyCalls = 0;
        beforeEach(function() {
          childElement = document.createElement('div');
          childElement.setAttribute('id', 'child');
          element.appendChild(childElement);
          spyOn(elementStrategy, 'isViewModel').and.callFake(function() {
            // first call checks childElement which doesn't have viewModel, but next(parent) has it
            return strategyCalls++ > 0;
          });
        });

        it('should return the context', function() {
          var context = viewContext.resolve(childElement);
          expect(context.viewModel).toBe(viewModel);
        });
      });
    });
  });
});
