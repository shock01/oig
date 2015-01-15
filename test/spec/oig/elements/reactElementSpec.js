describe('react element', function () {
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
   * @type {Object}
   */
  var viewModel;
  /**
   * @type {Object}
   */
  var component;
  var componentImpl;

  before(function () {
    Object.defineProperty(oig.viewModels, 'reactelement', {
      configurable: true,
      get: function () {
        return viewModel;
      }
    });
  });

  after(function () {
    delete oig.viewModels.reactelement;
    delete window.React;
    delete window.MyJSX;
  });

  beforeEach(function () {
    parent = document.createElement('div', 'oig-context');
    element = document.createElement('oig-react');
    element.setAttribute('component', 'MyJSX');
    parent.setAttribute('data-view-model', 'reactelement');
    parent.appendChild(element);
    viewModel = {
      person: {name: "John Doe"}
    };

  });

  afterEach(function () {
    parent.parentNode && parent.parentNode.removeChild(parent);
  });

  beforeEach(function () {
    component = {};
    componentImpl = {
      setState: sinon.stub()
    };

    window.React = {
      createElement: sinon.stub().returns(component),
      render: sinon.stub().returns(componentImpl)
    };

    window.MyJSX = {};
  })

  function append() {
    document.body.appendChild(parent);
  }

  it('should call react to create a new component', function () {
    append();
    expect(React.createElement.calledWith(MyJSX, null)).to.be.true;
  });

  it('should call render', function () {
    append();
    expect(React.render.calledWith(component, element)).to.be.true;
  });

  it('should update the state', function () {
    append();
    expect(componentImpl.setState.calledWith(viewModel)).to.be.true;
  });

  describe('when specifying context attribute', function () {

    beforeEach(function () {
      element.setAttribute('context', 'person');
    });

    it('should update the state', function () {
      append();
      expect(componentImpl.setState.calledWith(viewModel.person)).to.be.true;
    });
  });

  describe('when updating the viewModel', function () {
    beforeEach(function () {
      append();
      viewModel.name = '123';
    });

    it('should call render', function () {
      expect(React.render.calledWith(component, element)).to.be.true;
    });

    it('should update the state', function () {
      expect(componentImpl.setState.calledWith(viewModel)).to.be.true;
    });
  });
})
;
