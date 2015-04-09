describe('react element', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var parent;
  /**
   * @type {HTMLElement}
   */
  var reactElement;
  /**
   * @type {Object}
   */
  var viewModel;
  /**
   * @type {Object}
   */
  var component;
  var componentImpl;

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
    delete window.React;
    delete window.MyJSX;
  });

  beforeEach(function () {
    parent = new OigContextElement();
    reactElement = document.createElement('oig-react');
    reactElement.setAttribute('component', 'MyJSX');
    parent.setAttribute('view-model', 'reactelement');
    parent.appendChild(reactElement);
    viewModel = {
      person: {name: "John Doe"}
    };
    sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
  });

  afterEach(function () {
    sandbox.restore();
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
    expect(React.render.calledWith(component, reactElement)).to.be.true;
  });

  it('should update the state', function () {
    append();
    expect(componentImpl.setState.calledWith(viewModel)).to.be.true;
  });

  describe('when specifying context attribute', function () {

    beforeEach(function () {
      reactElement.setAttribute('context', 'person');
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
      expect(React.render.calledWith(component, reactElement)).to.be.true;
    });

    it('should update the state', function () {
      expect(componentImpl.setState.calledWith(viewModel)).to.be.true;
    });
  });
})
;
