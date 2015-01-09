var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     *
     * Adds dataContext to HTMLDivElement.
     * HTMLDivElement is the only element that can contain a dataContext because
     * the div element is used to define sections/regions in a html document.
     *
     * CustomEvent contextload
     * will be dispatched before leaving attachedCallback
     * bubbles: false
     * cancellable: false
     *
     * CustomEvent contextunload
     * will be dispatched on entering detachedCallback
     * bubbles: false
     * cancellable: false
     *
     * onload method on viewModel
     * when an onload method is defined on the viewModel the onload will be called
     * before dispatching the viewload event
     *
     * onunload method
     * when an onunload method is defined on the viewModel the onunload will be called
     * before dispatching the viewunload event
     *
     * <div is="oig-context" data-view-model="">
     *
     * @type {HTMLElement}
     * @lends {HTMLDivElement.prototype}
     */
    var ContextElement = Object.create(HTMLDivElement.prototype, {

      dataContext: {
        value: null,
        writable: true
      },
      /**
       * when attached to the DOM will verify that a dataContext
       * can be set based on configured viewModels
       *
       * calls onload when defined on dataContext
       * dispatches contextload event
       *
       * @throws 'required attribute data-view-model is missing'
       */
      attachedCallback: {
        value: function () {
          var viewModel = this.dataset.viewModel,
            dataContext = null;
          if(!viewModel) {
            throw '[oig:contextelement] required attribute data-view-model is missing';
          }
          if (oig.viewModels.hasOwnProperty(viewModel)) {
            dataContext = oig.viewModels[viewModel];
          }
          if (!dataContext) {
            throw '[oig:contextelement] no data context found for:' + viewModel;
          }
          this.dataContext = dataContext;
          this.viewModel = viewModel;
          if(typeof dataContext.onload === 'function') {
            dataContext.onload();
          }
          this.dispatchEvent(new CustomEvent('contextload'));
        }
      },
      /**
       * called when removed from the DOM
       *
       * calls onunload when defined on dataContext
       * dispatches contextunload event
       */
      detachedCallback: {
        value: function () {
          var dataContext = this.dataContext;
          if(typeof dataContext.onunload === 'function') {
            dataContext.onunload();
          }
          this.dispatchEvent(new CustomEvent('contextunload'));
        }
      }
    });
    /**
     * registration
     */
    elements.ContextElement = document.registerElement('oig-context', {
      prototype: ContextElement,
      extends: 'div'
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
