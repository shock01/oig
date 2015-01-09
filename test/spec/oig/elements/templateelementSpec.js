describe('template element', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var parent;
  /**
   * @type {HTMLElement}
   */
  var element;
  /**
   * @type {HTMLTemplateElement}
   */
  var template
  /**
   * @type {Object}
   */
  var viewModel;

  var defaultTemplateEngine;
  var customTemplateEngine;
  var templateExecutor;

  before(function () {
    Object.defineProperty(oig.viewModels, 'templateelement', {
      configurable: true,
      get: function () {
        return viewModel;
      }
    });
    templateExecutor = sinon.spy();
    defaultTemplateEngine = sinon.mock(oig.templateEngines.default);

    customTemplateEngine = {
      compile: sinon.stub()
    };

    beforeEach(function () {
      Object.defineProperty(oig.templateEngines, 'custom', {
        configurable: true,
        get: function () {
          return customTemplateEngine;
        }
      });
  });

  after(function () {
    delete oig.viewModels.template;
    defaultTemplateEngine.restore();
  });

  beforeEach(function () {
    parent = document.createElement('div', 'oig-context');
    element = document.createElement('div', 'oig-template');
    template = document.createElement('template');

    template.innerHTML = '<%=name%>';
    parent.setAttribute('data-view-model', 'templateelement');
    parent.appendChild(element);
    viewModel = {};
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
      element.appendChild(template);
      defaultTemplateEngine.expects('compile').withArgs('<%=name%>', viewModel).once().returns(function () {
        return '<div></div>';
      });
    });

    afterEach(function () {
      defaultTemplateEngine.verify();
    });

    it('should insert the content at the end', function () {
      append();
      expect(element.lastElementChild.outerHTML).to.be.equal('<div></div>');

    });
  });

  describe('when the element has a template with custom engine', function () {
      console.dir(oig.templateEngines)
      element.setAttribute('data-oig-templateengine', 'custom');
      element.appendChild(template);
    });

    afterEach(function () {
      delete oig.templateEngines.custom;
    });

    it('should insert the content at the end', function () {
      append();
      expect(oig.templateEngines.custom.compile.calledWith('<%=name%>', viewModel)).to.be.true;
    });
  });
})
