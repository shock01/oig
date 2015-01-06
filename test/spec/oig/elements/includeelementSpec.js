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
        resolve(html);
      });
    });

    describe('href attribute', function () {

      beforeEach(function () {
        element.setAttribute("href", "test.xml");
      });

      it('should call the resource', function (done) {
        promise.then(function () {
          done();
          expect(oig.resource.calledWith(element.getAttribute('href'))).to.be.true;
          expect(resource.load.called).to.be.true;
        });
        parent.appendChild(element);
      });
    });

    describe('href attribute with xpointer', function () {

      beforeEach(function () {
        element.setAttribute('href', 'test.xml');
        element.setAttribute('xpointer', '//*[@id=1]');
      });

      it('should change the element with the new contents', function (done) {
        promise.then(function () {
          done();
          expect(parent.innerHTML).to.equal('<span id="1">Hello</span>');
        });
        parent.appendChild(element);
      });
    });

    describe('parse as xml', function () {

      beforeEach(function () {
        element.setAttribute('href', 'test.xml');
        element.setAttribute('parse', 'xml');
      });

      it('should change the element with the new contents', function (done) {
        promise.then(function () {
          done();
          expect(parent.innerHTML).to.equal(html);
        });
        parent.appendChild(element);
      });
    });

    describe('parse as text', function () {

      beforeEach(function () {
        element.setAttribute('href', 'test.xml');
        element.setAttribute('parse', 'text');
      });

      it('should change the element with the new contents', function (done) {
        promise.then(function () {
          done();
          expect(parent.textContent).to.equal(html);
        });
        parent.appendChild(element);
      });
    });

  });
});
