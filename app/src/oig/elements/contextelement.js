/* jshint unused: false */
'use strict';
/**
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
 * <oig-context view-model="">
 */
var OigContextElement = document.registerElement('oig-context', {
  prototype: Object.create(OigElement.prototype, {
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
     * @throws 'required attribute view-model is missing'
     */
    attachedCallback: {
      value: function () {
        var viewModel = this.getAttribute('view-model'),
          dataContext = null,
          viewModelResolver = oig.locator.resolve('oigViewModelResolver');
        if (!viewModel) {
          throw '[oig:contextelement] required attribute view-model is missing';
        }
        try {
          dataContext = viewModelResolver.resolve(viewModel);
        } catch (e) {
          throw '[oig:contextelement] no data context found for:' + viewModel;
        }
        this.dataContext = dataContext;
        this.viewModel = viewModel;
        if (typeof dataContext.onload === 'function') {
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
        if (typeof dataContext.onunload === 'function') {
          dataContext.onunload();
        }
        this.dispatchEvent(new CustomEvent('contextunload'));
      }
    }
  })
});
