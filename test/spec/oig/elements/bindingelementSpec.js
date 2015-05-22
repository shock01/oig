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

  describe('attribute change and text content', function() {
    beforeEach(function () {
      viewModel = {
        name: 'John Doe'
      };
      sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
      parent = document.createElement('div');
      var html = '<oig-context view-model="binding" xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        '<div><oig-binding name="name">name</oig-binding></div>' +
        '</oig-context>';

      parent.innerHTML = html;
      element = parent.querySelector('div');
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

  describe('special attributes', function() {
    beforeEach(function () {
      viewModel = {
        disabled: true
      };
      sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
      parent = document.createElement('div');
      var html = '<oig-context view-model="binding" xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        '<div><oig-binding disabled="disabled" data-oig-value="123"></oig-binding></div>' +
        '</oig-context>';

      parent.innerHTML = html;
      element = parent.querySelector('div');
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
        expect(element.getAttribute('disabled')).to.equal('');
      });
    });

    describe('update binding', function () {

      beforeEach(function () {
        document.body.appendChild(parent);
      });


      beforeEach(function () {
        viewModel.disabled = false;
        bindingElement.update();
      });

      afterEach(function () {
        parent.parentNode && parent.parentNode.removeChild(parent);
      });

      it('should remove attribute', function () {
        expect(element.hasAttributes('disabled')).to.equal(false)
      });
    });
  });
});
