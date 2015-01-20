describe('if element', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var parent;
  /**
   * @type {HTMLElement}
   */
  var element;
  /**
   * @type {HTMLElement}
   */
  var content;
  /**
   * @type {Object}
   */
  var viewModel;

  before(function () {
    viewModel = {
      flag: true
    };
    oig.viewModels.ifViewModel = viewModel;
  })

  beforeEach(function () {
    parent = document.createElement('div', 'oig-context');
    parent.setAttribute('data-view-model', 'ifViewModel');
    element = document.createElement('oig-if');
    parent.appendChild(element);
  });

  afterEach(function () {
    parent.parentNode && parent.parentNode.removeChild(parent);
  });

  it('should be defined', function () {
    expect(element instanceof HTMLElement).to.be.true;
  });


  describe('text content', function () {

    var content;

    beforeEach(function () {
      content = '<template>hello world</template>';
      element.innerHTML = content;
    });

    describe('when evaluated true', function () {

      beforeEach(function () {
        element.setAttribute('test', 'flag');
        document.body.appendChild(parent);
      });

      it('should show the content', function () {
        expect(element.innerHTML).to.equal(content + 'hello world');
      });
    });

    describe('when evaluated false', function () {
      beforeEach(function () {
        element.setAttribute('test', '!flag');
        document.body.appendChild(parent);
      });

      it('should show the content as template', function () {
        expect(element.innerHTML).to.equal(content);
      });
    });
  });


  describe('when evaluated false', function () {

    var content;

    beforeEach(function () {
      content = '<template>test</template>';
      element.innerHTML = content;
      element.setAttribute('test', '!flag');
      document.body.appendChild(parent);
    });

    describe('and  evaluated true after attribute change', function () {

      beforeEach(function () {
        element.setAttribute('test', 'flag');
      });

      it('should show the content', function () {
        expect(element.innerHTML).to.equal(content + 'test');
      });
    });

    describe('and evaluated true after dataContext change', function () {
      beforeEach(function () {

        return new Promise(function (resolve) {
          Object.observe(viewModel, function observer(changes) {
            Object.unobserve(viewModel, observer);
            resolve();
          });
          viewModel.flag = false;
        });
      });

      it('should show the content', function () {
        expect(element.innerHTML).to.equal(content + 'test');
      });
    });
  });
});
