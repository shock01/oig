'use strict';

/**
 * Element to integrate ReactJS Components with dataContext
 * Will be updated when dataContext/viewModel changes
 */
var ReactElementProto = {
  /**
   * when attached to the DOM and attribute once is not thruthy then
   * add observers
   */
  attachedCallback: {
    value: function () {
      /*jshint evil: true */
      var jsxComponent = eval(this.getAttribute('component'));
      /*jshint evil: false */
      OigElement.prototype.attachedCallback.call(this);
      this.reactComponent = React.createElement(jsxComponent, null);
      this.update();
    }
  },
  /**
   * will update the props of the JSX Component and renders it
   * when context attribute is set on element then context will be
   * evaluated on dataContext
   */
  update: {
    value: function () {
      var dataContext = this.dataContext,
        state,
        reactComponent = this.reactComponent,
        context = this.getAttribute('context');

      if (typeof context === 'string' && context.trim().length > 0) {
        state = oig.evaluate(dataContext, context);
      } else {
        state = dataContext;
      }

      React.render(reactComponent, this).setState(state);
    }
  },
  /**
   * make sure to update only when element
   * is attached to the document
   */
  attributeChangedCallback: {
    value: function (/**String*/attrName) {
      if (this.ownerDocument.contains(this)) {
        this.update();
      }
    }
  }
};
/**
 * registration
 */
var OigReactElement = document.registerElement('oig-react', {
  prototype: Object.create(OigElement.prototype, ReactElementProto)
});
