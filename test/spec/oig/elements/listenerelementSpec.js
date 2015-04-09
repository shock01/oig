describe('listener element', function () {
  'use strict';

  // @todo add spec for removeAttribute onclick
  // @todo refactor me to something nicer

  /**
   * @type {HTMLElement}
   */
  var node,
    listener,
    button,
    secondaryButton,
    viewModel = {},
    oigViewModelResolver,
    sandbox;

  function dispatch(element, eventType) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventType, true, true, null);
    element.dispatchEvent(event);
    return event;
  }

  before(function () {
    sandbox = sinon.sandbox.create();
    oigViewModelResolver = oigLocator.resolve('oigViewModelResolver');
  });

  /**
   * setup
   */
  beforeEach(function () {
    viewModel = {};
    sandbox.stub(oigViewModelResolver, 'resolve').returns(viewModel);
  });

  beforeEach(function () {
    viewModel.clickedCallback = sinon.spy();
  });

  beforeEach(function () {
    node = new OigContextElement();
    node.setAttribute('view-model', 'listenerelement');
    listener = document.createElement('oig-listener');
    button = document.createElement('button');
    button.setAttribute('id', 'primaryButton');
    secondaryButton = document.createElement('button');
    secondaryButton.setAttribute('id', 'secondaryButton');
    node.appendChild(listener);
    node.appendChild(button);
    node.appendChild(secondaryButton);
    document.body.appendChild(node);
  });

  afterEach(function () {
    sandbox.restore();
    node.parentNode && node.parentNode.removeChild(node);
  });

  it('should call the dataContext clickedCallback on click', function () {
    listener.setAttribute('onclick', 'clickedCallback()');
    dispatch(button, 'click');
    // assert
    assert(viewModel.clickedCallback.called, 'clickedCallback not called');
  });

  it('should call the dataContext clickedCallback on click using selector', function () {
    listener.setAttribute('selector', 'span');
    listener.setAttribute('onclick', 'clickedCallback()');

    // assert
    dispatch(button, 'click'); // dispatch on non-target
    assert(!viewModel.clickedCallback.called, 'clickedCallback should not be called on non-selector');

    listener.setAttribute('selector', 'button');
    dispatch(secondaryButton, 'click'); // dispatch on non-target
    assert(viewModel.clickedCallback.called, 'clickedCallback not called on selector');

  });

  it('should call the dataContext clickedCallback on click target', function () {
    listener.setAttribute('target', 'secondaryButton');
    listener.setAttribute('onclick', 'clickedCallback()');

    // assert
    dispatch(button, 'click'); // dispatch on non-target
    assert(!viewModel.clickedCallback.called, 'clickedCallback should not be called on non-target');

    dispatch(secondaryButton, 'click'); // dispatch on non-target
    assert(viewModel.clickedCallback.called, 'clickedCallback should not be called on target');

  });

  it('should call the dataContext clickedCallback on click with parameters', function () {
    viewModel.name = 'test';
    listener.setAttribute('onclick', 'clickedCallback(name)');
    dispatch(button, 'click');
    // assert
    assert(viewModel.clickedCallback.calledWith(viewModel.name), 'clickedCallback not called with argument name');
  });

  it('should prevent default', function () {

    var event;
    listener.setAttribute('onclick', 'clickedCallback(name)');
    event = dispatch(button, 'click');
    assert(!event.defaultPrevented, 'by default should initially not be prevented');

    listener.setAttribute('prevent-default', 'true');
    event = dispatch(button, 'click');

    assert(event.defaultPrevented, 'should be prevented when set to true');

    listener.setAttribute('prevent-default', '');
    event = dispatch(button, 'click');

    assert(event.defaultPrevented, 'should be prevented when attribute empty');

    listener.setAttribute('prevent-default', 'false');
    event = dispatch(button, 'click');

    assert(!event.defaultPrevented, 'should not be prevented when attribute false');

  });

  it('should stop propagation/bubbling', function () {

    var event;
    listener.setAttribute('onclick', 'clickedCallback(name)');
    event = dispatch(button, 'click');
    assert(!event.cancelBubble, 'by default should not stop propagation');

    listener.setAttribute('stop-propagation', 'true');
    event = dispatch(button, 'click');
    assert(event.cancelBubble, 'should stop propagation when set to true');

    listener.setAttribute('stop-propagation', '');
    event = dispatch(button, 'click');
    assert(event.cancelBubble, 'should stop propagation when attribute empty');

    listener.setAttribute('stop-propagation', 'false');
    event = dispatch(button, 'click');

    assert(!event.cancelBubble, 'should not stop propagation when when attribute false');

  });
});
