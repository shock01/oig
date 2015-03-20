describe('if element', function () {
  'use strict';

  /**
   * @type {HTMLElement}
   */
  var parent;
  /**
   * @type {HTMLElement}
   */
  var ifElement;
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
    ifElement = document.createElement('oig-if');
    parent.appendChild(ifElement);
  });

  afterEach(function () {
    parent.parentNode && parent.parentNode.removeChild(parent);
  });

  it('should be defined', function () {
    expect(ifElement instanceof HTMLElement).to.be.true;
  });


  describe('text content', function () {

    var content;

    beforeEach(function () {
      content = '<template>hello world</template>';
      ifElement.innerHTML = content;
    });

    describe('when evaluated true', function () {

      beforeEach(function () {
        ifElement.setAttribute('test', 'flag');
        document.body.appendChild(parent);
      });

      it('should show the content', function () {
        expect(ifElement.innerHTML).to.equal(content + 'hello world');
      });
    });

    describe('when evaluated false', function () {
      beforeEach(function () {
        ifElement.setAttribute('test', '!flag');
        document.body.appendChild(parent);
      });

      it('should show the content as template', function () {
        expect(ifElement.innerHTML).to.equal(content);
      });
    });
  });


  describe('when evaluated false', function () {

    var content;

    beforeEach(function () {
      content = '<template>test</template>';
      ifElement.innerHTML = content;
      ifElement.setAttribute('test', '!flag');
      document.body.appendChild(parent);
    });

    describe('and  evaluated true after attribute change', function () {

      beforeEach(function () {
        ifElement.setAttribute('test', 'flag');
      });

      it('should show the content', function () {
        expect(ifElement.innerHTML).to.equal(content + 'test');
      });
    });

    describe('and evaluated true after dataContext change', function () {
      beforeEach(function () {
        viewModel.flag = false;
        ifElement.update();
      });

      it('should show the content', function () {
        expect(ifElement.innerHTML).to.equal(content + 'test');
      });
    });
  });
});
