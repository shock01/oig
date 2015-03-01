'use strict';

var IfElement = {
  /**
   * when attached to the DOM and attribute once is not thruthy then
   * add observers
   */
  attachedCallback: {
    value: function () {
      oig.Element.prototype.attachedCallback.call(this);
      this.update();
    }
  },
  update: {
    value: function () {
      var test = this.getAttribute('test'),
        flag = oig.evaluate(this.dataContext, test),
        template = this.firstElementChild;

      if (flag) {
        this.insertBefore(this.ownerDocument.importNode(template.content, true), template.nextElementSibling);
      } else {
        while (template.nextSibling) {
          this.removeChild(template.nextSibling);
        }
      }
    }
  },
  /**
   * when the test attribute changes make sure to update only when element
   * is attached to the document
   */
  attributeChangedCallback: {
    value: function (/**String*/attrName) {
      if (this.ownerDocument.contains(this) && attrName === 'test') {
        this.update();
      }
    }
  }
};
/**
 * registration
 */
elements.IfElement = document.registerElement('oig-if', {
  prototype: Object.create(oig.Element.prototype, IfElement)
});
