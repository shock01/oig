describe('bindingelement', function () {
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
   * @type {BindingElement}
   */
  var bindingElement;
  /**
   * @type {Object}
   */
  var viewModel;

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
      return new Promise(function (resolve) {
        Object.observe(viewModel, function observer(changes) {
          Object.unobserve(viewModel, observer);
          resolve();
        });
        viewModel.name = 'test';
      });
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

  describe('bind once', function () {

    function verifyBindOnce() {
      beforeEach(function () {

        return new Promise(function (resolve) {
          Object.observe(viewModel, function observer(changes) {
            Object.unobserve(viewModel, observer);
            resolve();
          });
          viewModel.name = 'test';
        });
      });

      afterEach(function () {
        parent.parentNode && parent.parentNode.removeChild(parent);
      });

      it('should not have updated the name attribute', function () {
        expect(element.getAttribute('name')).to.equal('John Doe');
      });

      it('should not have updated the text content', function () {
        expect(bindingElement.shadowRoot.textContent).to.equal('John Doe');
      });
    }

    describe('update binding using once attribute', function () {

      beforeEach(function () {
        bindingElement.setAttribute('once', '');
        document.body.appendChild(parent);
      });

      verifyBindOnce();
    });

    describe('update binding using once attribute true', function () {

      beforeEach(function () {
        bindingElement.setAttribute('once', 'true');
        document.body.appendChild(parent);
      });

      verifyBindOnce();
    });

  });
});
