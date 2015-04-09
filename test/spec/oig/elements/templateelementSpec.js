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
    parent = new OigContextElement();
    templateElement = document.createElement('div', 'oig-template');
    template = document.createElement('template');

    template.innerHTML = '<%=name%>';
    parent.setAttribute('view-model', 'templateelement');
    parent.appendChild(templateElement);
    viewModel = {
      count: 0
    };
    sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
  });

  beforeEach(function () {
    defaultTemplateEngine = sinon.mock(oig.templateEngines.default);
  });

  afterEach(function () {
    sandbox.restore();
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
      viewModel.count++;
      templateElement.update();
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
