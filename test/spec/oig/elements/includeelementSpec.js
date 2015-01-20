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
   * @type {Object}
   */
  var mock;

  /**
   * @type {Promise}
   */
  var promise;

  beforeEach(function () {
    mock = sinon.mock(oig);
  });

  afterEach(function () {
    mock.restore();
  });

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
      promise = new Promise(function (resolve) {
        resolve('<div><span id="1">Hello</span><span id="2">World</span></div>');
      });
    });

    describe('href attribute', function () {

      beforeEach(function () {
        mock.expects('resource').withArgs('test.xml').once().returns(resource);
        element.setAttribute("href", "test.xml");
        parent.appendChild(element);
        return promise;
      });

      afterEach(function () {
        mock.verify();
      });

      it('should call the resource', function () {
        expect(resource.load.called).to.be.true;
      });
    });

    describe('no href attribute with xpointer', function () {

      beforeEach(function () {
        mock.expects('resource').withArgs(document.URL).once().returns(resource);
        element.setAttribute("xpointer", "//div");
        parent.appendChild(element);
        return promise;
      });

      afterEach(function () {
        mock.verify();
      });

      it('should call the resource', function () {
        expect(resource.load.called).to.be.true;
      });
    });

    describe('href attribute with xpointer', function () {

      beforeEach(function () {

        mock.expects('resource').withArgs('test.xml').once().returns(resource);

        element.setAttribute('href', 'test.xml');
        element.setAttribute('xpointer', '//*[@id=1]');
        parent.appendChild(element);
        return promise;
      });

      afterEach(function () {
        mock.verify();
      });

      it('should change the element with the new contents', function () {
        expect(parent.innerHTML).to.equal('<span id="1">Hello</span>');
      });
    });

    describe('parse as xml', function () {

      beforeEach(function () {

        mock.expects('resource').withArgs('test.xml').once().returns(resource);

        element.setAttribute('href', 'test.xml');
        element.setAttribute('parse', 'xml');
        parent.appendChild(element);
        return promise;
      });

      afterEach(function () {
        mock.verify();
      });

      it('should change the element with the new contents', function () {
        expect(parent.innerHTML).to.equal(html);
      });
    });

    describe('parse as text', function () {

      beforeEach(function () {
        mock.expects('resource').withArgs('test.xml').once().returns(resource);
        element.setAttribute('href', 'test.xml');
        element.setAttribute('parse', 'text');
        parent.appendChild(element);
        return promise;
      });

      afterEach(function () {
        mock.verify();
      })

      it('should change the element with the new contents', function () {
        expect(parent.textContent).to.equal(html);
      });
    });
  });

  describe('error on loading include', function () {

    beforeEach(function () {
      mock.expects('resource').withArgs('test.xml').once().returns(resource);
      promise = new Promise(function (resolve, reject) {
        reject('404');
      });
    })

    afterEach(function () {
      mock.verify();
    });

    function append() {
      element.setAttribute("href", "test.xml");
      parent.appendChild(element);
    }

    describe('with fallback', function () {

      var fallback;

      beforeEach(function () {
        fallback = document.createElement('template');
        fallback.content.appendChild(document.createTextNode('error'));
        element.appendChild(fallback);
      });


      it('should have used the fallback on error', function (done) {

        append();

        promise.catch(function () {
          // we have to wait until catch is handled by include element
          setTimeout(function () {
            expect(parent.innerHTML).to.equal('error');
            done();
          }, 0);
        });
      });
    });
  });

});
