describe('include element', function () {


  /**
   * depends on oig.resource
   */

  'use strict';

  /**
   * @type {HTMLElement}
   */
  var element;
  /**
   * @type {HTMLElement}
   */
  var parent;
  /**
   * @type {Object}
   */
  var resource;
  /**
   * @type {Promise}
   */
  var promise;

  before(function () {
    sinon.stub(oig, "resource", function () {
      return resource;
    });
  })

  beforeEach(function () {
    resource = {
      load: function () {
      },
      cancel: sinon.stub()
    };

    sinon.stub(resource, 'load', function () {
      return promise;
    });
  });

  beforeEach(function () {
    parent = document.createElement('div');
    element = document.createElement('oig-include');
    document.body.appendChild(parent);
  });

  afterEach(function () {
    parent.parentNode && parent.parentNode.removeChild(parent);
  });

  it('should have an element defined', function () {
    assert(element instanceof HTMLElement, 'Element should be defined');
  });

  describe('attaching to DOM', function () {

    var html;

    beforeEach(function () {
      html = '<div><span id="1">Hello</span><span id="2">World</span></div>';
      promise = new Promise(function (resolve, reject) {
        resolve('<div><span id="1">Hello</span><span id="2">World</span></div>');
      });
    });

    describe('href attribute', function () {

      beforeEach(function () {
        element.setAttribute("href", "test.xml");
        parent.appendChild(element);
        return promise;
      });

      it('should call the resource', function () {
        expect(oig.resource.calledWith(element.getAttribute('href'))).to.be.true;
        expect(resource.load.called).to.be.true;

      });
    });

    describe('no href attribute with xpointer', function () {

      beforeEach(function () {
        element.setAttribute("xpointer", "//div");
        parent.appendChild(element);
        return promise;
      });

      it('should call the resource', function () {
        expect(oig.resource.calledWith(document.URL)).to.be.true;
        expect(resource.load.called).to.be.true;
      });
    });

    describe('href attribute with xpointer', function () {

      beforeEach(function () {
        element.setAttribute('href', 'test.xml');
        element.setAttribute('xpointer', '//*[@id=1]');
        parent.appendChild(element);
        return promise;
      });

      it('should change the element with the new contents', function () {
        expect(parent.innerHTML).to.equal('<span id="1">Hello</span>');
      });
    });

    describe('parse as xml', function () {

      beforeEach(function () {
        element.setAttribute('href', 'test.xml');
        element.setAttribute('parse', 'xml');
        parent.appendChild(element);
        return promise;
      });

      it('should change the element with the new contents', function () {
        expect(parent.innerHTML).to.equal(html);
      });
    });

    describe('parse as text', function () {

      beforeEach(function () {
        element.setAttribute('href', 'test.xml');
        element.setAttribute('parse', 'text');
        parent.appendChild(element);
        return promise;
      });

      it('should change the element with the new contents', function () {
        expect(parent.textContent).to.equal(html);
      });
    });

  });
});
