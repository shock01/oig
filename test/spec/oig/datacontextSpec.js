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
   * @type {Objecgt}
   */
  var viewModel;


  beforeEach(function (done) {

    viewModel = {};


    Object.defineProperty(oig.viewModels, 'my', {
      value: viewModel
    });

    node = new OigContextElement();
    node.setAttribute('data-view-model', 'my');
    child = document.createElement('div');
    node.appendChild(child);
    document.body.appendChild(node);
    done();
  });

  afterEach(function () {
    document.body.removeChild(node);
  });

  it('should resolve the context', function () {
    assert(dataContextResolver(child) === viewModel, 'Cannot resolve dataContext');
  });
});
