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
      spyOn(elementStrategy, 'isView').and.returnValue(false);
      expect(function() {
        viewContext.init(element);
      }).toThrow('[oig:viewcontext] no data-oig-view attribute is set');
      expect(elementStrategy.isView).toHaveBeenCalledWith(element);
    });

    describe('when element is valid', function() {
      var viewModelName = 'viewmodel';
      beforeEach(function() {
        spyOn(elementStrategy, 'isView').and.returnValue(true);
        spyOn(elementStrategy, 'view').and.returnValue(viewName);
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
        expect(diContext.resolve).toHaveBeenCalledWith(viewName);
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
        spyOn(elementStrategy, 'isView').and.returnValue(true);
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
          expect(diContext.resolve.calls.count()).toEqual(1);
        });
      });
    });
  });

  // @todo, what are we testing here?
  describe('when register element', function() {
    var view = {
        'view': true
      },
      strategyCalls = 0;

    describe('when element is registered', function() {
      beforeEach(function() {
        spyOn(diContext, 'resolve').and.returnValue(view);
        viewContext.register(element, 'view');
      });
      it('should return the context', function() {
        var registeredView = viewContext.resolve(element);
        expect(diContext.resolve).toHaveBeenCalledWith('view');
        expect(registeredView).toBe(view);
      });

      describe('when a child element wants to resolve', function() {
        var childElement;
        beforeEach(function() {
          childElement = document.createElement('div');
          childElement.setAttribute('id', 'child');
          element.appendChild(childElement);
          spyOn(elementStrategy, 'isView').and.callFake(function() {
            // first call checks childElement which doesn't have view, but next(parent) has it
            return strategyCalls++ > 0;
          });
        });

        it('should return the context', function() {
          var registeredView = viewContext.resolve(childElement);
          expect(registeredView).toBe(view);
        });
      });
    });
  });
});
