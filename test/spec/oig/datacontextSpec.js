describe('datacontext', function () {
  'use strict';

  var /**HTMLElement*/node,
    /**HTMLElement*/child,
    /**HTMLElement*/viewModel;


  beforeEach(function (done) {

    viewModel = {};


    Object.defineProperty(oig.viewModels, 'my', {
      value: viewModel
    });

    node = new oig.elements.ContextElement();
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
    assert(oig.dataContext(child) === viewModel, 'Cannot resolve dataContext');
  });
});
