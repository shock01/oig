xdescribe('include element', function() {


  /**
   * I hate this file, if it's hard to test it's hard to read, it's hard to maintain.....
   * so i really need to refactor this one.
   */

  /**
   * depends on oig.resource
   */

  'use strict';

  /**
   * @type {HTMLElement}
   */
  var includeElement;
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

  var sandbox;

  /**
   *
   */
  var oigResource;

  beforeEach(function() {
    oigResource = oigLocator.resolve('oigResource');
    sandbox = sinon.sandbox.create();
  });

  beforeEach(function() {
    parent = document.createElement('div');
    includeElement = document.createElement('oig-include');
    document.body.appendChild(parent);
  });

  afterEach(function() {
    sandbox.restore();
    parent.parentNode && parent.parentNode.removeChild(parent);
  });

  it('should have an element defined', function() {
    assert(includeElement instanceof HTMLElement, 'Element should be defined');
  });

  describe('attaching to DOM', function() {

    var html;

    beforeEach(function() {
      html = '<div><span id="1">Hello</span><span id="2">World</span></div>';
      promise = new Promise(function(resolve) {
        resolve('<div><span id="1">Hello</span><span id="2">World</span></div>');
      });
      sandbox.stub(oigResource, 'load').returns(promise);
    });

    afterEach(function() {
      oigResource.load.reset();
    });

    describe('href attribute', function() {

      beforeEach(function() {
        includeElement.setAttribute('href', 'test.xml');
        parent.appendChild(includeElement);
        return promise;
      });

      it('should call the resource', function() {
        expect(oigResource.load.calledWith('test.xml')).to.be.true;
      });
    });

    describe('no href attribute with xpointer', function() {

      beforeEach(function() {
        includeElement.setAttribute("xpointer", "//div");
        parent.appendChild(includeElement);
        return promise;
      });

      it('should call the resource', function() {
        expect(oigResource.load.calledWith(document.URL)).to.be.true;
      });
    });

    describe('href attribute with xpointer', function() {

      beforeEach(function() {
        includeElement.setAttribute('href', 'test.xml');
        includeElement.setAttribute('xpointer', '//*[@id=1]');
        parent.appendChild(includeElement);
        return promise;
      });

      it('should change the element with the new contents', function() {
        expect(oigResource.load.calledWith('test.xml')).to.be.true;
        expect(parent.innerHTML).to.equal('<span id="1">Hello</span>');
      });
    });

    describe('parse as xml', function() {

      beforeEach(function() {
        includeElement.setAttribute('href', 'test.xml');
        includeElement.setAttribute('parse', 'xml');
        parent.appendChild(includeElement);
        return promise;
      });

      it('should change the element with the new contents', function() {
        expect(oigResource.load.calledWith('test.xml')).to.be.true;
        expect(parent.innerHTML).to.equal(html);
      });
    });

    describe('parse as text', function() {

      beforeEach(function() {
        includeElement.setAttribute('href', 'test.xml');
        includeElement.setAttribute('parse', 'text');
        parent.appendChild(includeElement);
        return promise;
      });

      it('should change the element with the new contents', function() {
        expect(oigResource.load.calledWith('test.xml')).to.be.true;
        expect(parent.textContent).to.equal(html);
      });
    });
  });

  describe('error on loading include', function() {

    beforeEach(function() {
      promise = new Promise(function(resolve, reject) {
        reject('404');
      });
      sandbox.stub(oigResource, 'load').withArgs('text.xml').returns(promise);
    })

    function append() {
      includeElement.setAttribute('href', 'text.xml');
      parent.appendChild(includeElement);
    }

    describe('with fallback', function() {

      var fallback;

      beforeEach(function() {
        fallback = document.createElement('template');
        fallback.content.appendChild(document.createTextNode('error'));
        includeElement.appendChild(fallback);
      });


      it('should have used the fallback on error', function(done) {

        append();

        promise.catch(function() {
          // we have to wait until catch is handled by include element
          setTimeout(function() {
            expect(parent.innerHTML).to.equal('error');
            done();
          }, 0);
        });
      });
    });
  });
});
