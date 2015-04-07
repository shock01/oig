describe('context element', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var node;
  /**
   * @type {Object}
   */
  var viewModel;

  /**
   * @type {Object}
   */
  var oigViewModelResolver;

  /**
   * @type {Object}
   */
  var sandbox;

  beforeEach(function (done) {

    viewModel = {
      name: 'some viewmodel',
      onload: function () {
      },
      onunload: function () {
      }
    };

    sandbox = sinon.sandbox.create();
    oigViewModelResolver = oigLocator.resolve('oigViewModelResolver');
    sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);

    node = new OigContextElement();
    node.setAttribute('view-model', 'me');

    done();
  });

  afterEach(function () {
    sandbox.restore();
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });

  describe('datacontext', function () {
    beforeEach(function () {
      document.body.appendChild(node);
    });

    it('should set the viewModel on the element', function () {
      expect(node.viewModel).to.equal('me');
    });

    it('should set the dataContext to the element', function () {
      expect(node.dataContext).to.equal(viewModel);
    });
  });

  describe('events', function () {

    describe('contextload event', function () {

      it('should dispatch contextload when appended to DOM', function () {
        var event;
        node.addEventListener('contextload', function (contextLoadEvent) {
          event = contextLoadEvent;
        });
        document.body.appendChild(node);

        expect(event).to.be.defined;
        expect(event.cancelable).to.be.false;
        expect(event.bubbles).to.be.false;

      });

      describe('contextunload event', function () {
        it('should dispatch contextunload when removed from the DOM', function () {
          var event;
          node.addEventListener('contextunload', function (contextUnloadEvent) {
            event = contextUnloadEvent;
          });
          document.body.appendChild(node);
          document.body.removeChild(node);

          expect(event).to.be.defined;
          expect(event.cancelable).to.be.false;
          expect(event.bubbles).to.be.false;

        });
      });
    });
  });

  describe('lifecycle callbacks', function () {

    beforeEach(function () {
      viewModel.onload = sinon.stub();
      viewModel.onunload = sinon.stub();
    });

    describe('onload', function () {
      it('should call onload before dispatching the event', function () {
        var called;

        node.addEventListener('contextload', function () {
          called = viewModel.onload.called;
        });
        document.body.appendChild(node);
        expect(called).to.be.true();
      });

      describe('onunload', function () {
        it('should call onunload before dispatching event', function () {
          var called;
          node.addEventListener('contextunload', function () {
            called = viewModel.onunload.called;
          });
          document.body.appendChild(node);
          document.body.removeChild(node);
          expect(called).to.be.true();
        });
      });
    });
  });

});
