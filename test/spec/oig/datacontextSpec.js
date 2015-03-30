describe('datacontext', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var node;
  /**
   * @type {HTMLElement}
   */
  var child;

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

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    viewModel = {};
    oigViewModelResolver = oigLocator.resolve('oigViewModelResolver');
    sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
  });

  beforeEach(function (done) {
    node = new OigContextElement();
    node.setAttribute('data-view-model', 'my');
    child = document.createElement('div');
    node.appendChild(child);
    document.body.appendChild(node);
    done();
  });

  afterEach(function () {
    sandbox.restore();
    document.body.removeChild(node);
  });

  it('should call resolver for the context', function () {
    expect(oigViewModelResolver.resolve.calledWith('my')).to.be.true;
  });

  it('should resolve the context', function () {
    assert(dataContextResolver(child) === viewModel, 'Cannot resolve dataContext');
  });
});
