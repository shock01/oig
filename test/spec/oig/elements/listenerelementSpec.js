describe('listenerelement', function () {
  'use strict';

  // @todo add spec for removeAttribute onclick

  /**
   * @type {HTMLElement}
   */
  var node,
    listener,
    button,
    secondaryButton,
    dataContext = {};


  function dispatch(element, eventType) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventType, true, true, null);
    element.dispatchEvent(event);
    return event;
  }

  /**
   * setup
   */
  before(function (done) {
    oig.dataContext = function () {
    };
    done();
  });

  beforeEach(function (done) {
    dataContext.clickedCallback = sinon.spy();
    done();
  });


  beforeEach(function (done) {
    node = document.createElement('div');
    listener = document.createElement('oig-listener');
    button = document.createElement('button');
    button.setAttribute('id', 'primaryButton');
    secondaryButton = document.createElement('button');
    secondaryButton.setAttribute('id', 'secondaryButton');
    node.appendChild(listener);
    node.appendChild(button);
    node.appendChild(secondaryButton);
    document.body.appendChild(node);
    done();
  });

  afterEach(function () {
    document.body.removeChild(node);
  });

  it('should call the dataContext clickedCallback on click', function () {
    oig.dataContext = sinon.stub().returns(dataContext);
    listener.setAttribute('onclick', 'clickedCallback()');
    dispatch(button, 'click');
    // assert
    assert(dataContext.clickedCallback.called, 'clickedCallback not called');
    // verify
    assert(oig.dataContext.calledWith(listener));
  });

  it('should call the dataContext clickedCallback on click using selector', function () {
    oig.dataContext = sinon.stub().returns(dataContext);
    listener.setAttribute('selector', 'span');
    listener.setAttribute('onclick', 'clickedCallback()');

    // assert
    dispatch(button, 'click'); // dispatch on non-target
    assert(!dataContext.clickedCallback.called, 'clickedCallback should not be called on non-selector');

    listener.setAttribute('selector', 'button');
    dispatch(secondaryButton, 'click'); // dispatch on non-target
    assert(dataContext.clickedCallback.called, 'clickedCallback not called on selector');

    // verify
    assert(oig.dataContext.calledWith(listener));
  });

  it('should call the dataContext clickedCallback on click target', function () {
    oig.dataContext = sinon.stub().returns(dataContext);
    listener.setAttribute('target', 'secondaryButton');
    listener.setAttribute('onclick', 'clickedCallback()');

    // assert
    dispatch(button, 'click'); // dispatch on non-target
    assert(!dataContext.clickedCallback.called, 'clickedCallback should not be called on non-target');

    dispatch(secondaryButton, 'click'); // dispatch on non-target
    assert(dataContext.clickedCallback.called, 'clickedCallback should not be called on target');

    // verify
    assert(oig.dataContext.calledWith(listener));
  });

  it('should call the dataContext clickedCallback on click with parameters', function () {
    dataContext.name = 'test';
    oig.dataContext = sinon.stub().returns(dataContext);
    listener.setAttribute('onclick', 'clickedCallback(name)');
    dispatch(button, 'click');
    // assert
    assert(dataContext.clickedCallback.calledWith(dataContext.name), 'clickedCallback not called with argument name');
    // verify
    assert(oig.dataContext.calledWith(listener));
  });

  it('should prevent default', function () {

    var event;
    oig.dataContext = sinon.stub().returns(dataContext);
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
    oig.dataContext = sinon.stub().returns(dataContext);
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
