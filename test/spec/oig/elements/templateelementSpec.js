describe('template element', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var parent;
  /**
   * @type {HTMLElement}
   */
  var templateElement;
  /**
   * @type {HTMLTemplateElement}
   */
  var template;
  /**
   * @type {Object}
   */
  var viewModel;

  var defaultTemplateEngine;
  var customTemplateEngine;

  before(function () {
    Object.defineProperty(oig.viewModels, 'templateelement', {
      configurable: true,
      get: function () {
        return viewModel;
      }
    });
    customTemplateEngine = {
      compile: sinon.stub()
    };
  });

  after(function () {
    delete oig.viewModels.template;
  });

  beforeEach(function () {
    Object.defineProperty(oig.templateEngines, 'custom', {
      configurable: true,
      get: function () {
        return customTemplateEngine;
      }
    });
  });

  beforeEach(function () {
    parent = document.createElement('div', 'oig-context');
    templateElement = document.createElement('div', 'oig-template');
    template = document.createElement('template');

    template.innerHTML = '<%=name%>';
    parent.setAttribute('data-view-model', 'templateelement');
    parent.appendChild(templateElement);
    viewModel = {
      count: 0
    };
  });

  beforeEach(function () {
    defaultTemplateEngine = sinon.mock(oig.templateEngines.default);
  });

  afterEach(function () {
    defaultTemplateEngine.restore();
  });

  afterEach(function () {
    parent.parentNode && parent.parentNode.removeChild(parent);
  });

  function append() {
    document.body.appendChild(parent);
  }

  it('throw an exception when there is no template element', function () {
    expect(append).to.throw;
  });

  describe('when the element has a template', function () {

    beforeEach(function () {
      templateElement.appendChild(template);
      defaultTemplateEngine.expects('compile').withArgs('<%=name%>', viewModel).once().returns('<div></div>');
    });

    afterEach(function () {
      defaultTemplateEngine.verify();
    });

    it('should insert the content at the end', function () {
      append();
      expect(templateElement.lastElementChild.outerHTML).to.be.equal('<div></div>');
    });
  });

  describe('when viewModel changes', function () {
    beforeEach(function () {
      templateElement.appendChild(template);
      defaultTemplateEngine.expects('compile').withArgs('<%=name%>', viewModel).twice().returns('<div></div>');
      append();
      var promise = new Promise(function (resolve) {
        Object.observe(viewModel, function (changes) {
          defaultTemplateEngine.verify();
          resolve();
        });

        viewModel.count++;

      });
      return promise;
    });

    it('should insert the content at the end', function () {
      expect(template.nextElementSibling).to.equal(templateElement.lastElementChild);
    });
  });

  describe('when the element has a template with custom engine', function () {

    beforeEach(function () {
      templateElement.setAttribute('data-oig-templateengine', 'custom');
      templateElement.appendChild(template);
    });

    afterEach(function () {
      delete oig.templateEngines.custom;
    });

    it('should insert the content at the end', function () {
      append();
      expect(oig.templateEngines.custom.compile.calledWith('<%=name%>', viewModel)).to.be.true;
    });
  });


});
