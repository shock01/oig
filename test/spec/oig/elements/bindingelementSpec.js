describe('binding element', function () {
  'use strict';

  /**
   * @type {Node}
   */
  var parent;
  /**
   * @type {Node}
   */
  var element;
  /**
   * @type {OigBindingElementProto}
   */
  var bindingElement;
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

  before(function () {
    sandbox = sinon.sandbox.create();
    oigViewModelResolver = oigLocator.resolve('oigViewModelResolver');
  });

  after(function () {
    delete oig.viewModels.binding;
  });


  beforeEach(function () {
    viewModel = {
      name: 'John Doe'
    };
    sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
    parent = document.createElement('div');
    var html = '<oig-context view-model="binding" xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<oig-binding name="name">name</oig-binding>' +
      '</oig-context>';

    parent.innerHTML = html;
    element = parent.firstElementChild;
    bindingElement = element.firstElementChild;
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('binding', function () {
    beforeEach(function () {
      document.body.appendChild(parent);
    });

    afterEach(function () {
      parent.parentNode && parent.parentNode.removeChild(parent);
    });

    it('should have updated the name attribute', function () {
      expect(element.getAttribute('name')).to.equal(viewModel.name);
    });

    it('should have updated the text content', function () {
      expect(bindingElement.shadowRoot.textContent).to.equal(viewModel.name);
    });
  })


  describe('update binding', function () {

    beforeEach(function () {
      document.body.appendChild(parent);
    });


    beforeEach(function () {
      viewModel.name = 'test';
      bindingElement.update();
    });

    afterEach(function () {
      parent.parentNode && parent.parentNode.removeChild(parent);
    });

    it('should have updated the name attribute', function () {
      expect(element.getAttribute('name')).to.equal(viewModel.name);
    });

    it('should have updated the text content', function () {
      expect(bindingElement.shadowRoot.textContent).to.equal(viewModel.name);
    });
  });
});
