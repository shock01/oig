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
   *
   */
  var objectObserver;

  before(function () {

    Object.defineProperty(oig.viewModels, 'binding', {
      configurable: true,
      get: function () {
        return viewModel;
      }
    });
  });

  after(function () {
    delete oig.viewModels.binding;
  });


  beforeEach(function () {
    viewModel = {
      name: 'John Doe'
    };

    parent = document.createElement('div');
    var html = '<div xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" is="oig-context" data-view-model="binding">' +
      '<oig-binding name="name">name</oig-binding>' +
      '</div>';

    parent.innerHTML = html;
    element = parent.firstElementChild;
    bindingElement = element.firstElementChild;
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
