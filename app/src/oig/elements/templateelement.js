'use strict';

/**
 *
 * will decode html like into a textarea
 *
 * @param {String} html
 * @returns {String}
 */
function templateElementDecodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

var TemplateElementProto = {
  /**
   */
  attachedCallback: {
    value: function () {

      OigElement.prototype.attachedCallback.call(this);
      this.update();
    }
  },
  update: {
    value: function () {

      var templateElement = this.firstElementChild,
        nextSibling,
        dataContext = this.dataContext,
        templateEngine,
        template,
        html;
      if (!(templateElement instanceof HTMLTemplateElement)) {
        throw '[oig:templateelement] first element needs to be a template element';
      }

      if (this.dataset.oigTemplateengine) {
        templateEngine = oig.templateEngines[this.dataset.oigTemplateengine];
      } else {
        templateEngine = oig.templateEngines.default;
      }
      if (!templateEngine) {
        throw '[oig:templateelement] no templateengine found';
      }
      template = templateElementDecodeHtml(new XMLSerializer().serializeToString(templateElement.content, 'text/html'));
      html = templateEngine.compile(template, dataContext);

      // remove any previous rendered content
      while ((nextSibling = templateElement.nextSibling) !== null) {
        this.removeChild(templateElement.nextSibling);
      }

      this.insertAdjacentHTML('beforeend', html);
    }
  }
};
/**
 * registration
 */
var OigTemplateElement = document.registerElement('oig-template', {
  prototype: Object.create(OigElement.prototype, TemplateElementProto),
  extends: 'div'
});
