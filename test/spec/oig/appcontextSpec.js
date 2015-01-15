describe('appcontext', function () {

  // @todo use promises as in ifelementSpec

  'use strict';
  var dataContext;

  beforeEach(function () {
    dataContext = {
      name: 'john doe',
      count: 0,
      increment: function () {
        this.count++;
      }
    };
  });

  describe('evaluate', function () {
    it('should return name', function () {
      assert(oig.evaluate(dataContext, 'name') === dataContext.name, 'name should be evaluated');
    });

    it('should assign name', function () {
      oig.evaluate(dataContext, 'name = "james doe"');
      assert('james doe' === dataContext.name, 'name should be evaluated');
    });

    it('should increment when method is invoked on viewModel', function () {
      oig.evaluate(dataContext, 'increment()');
      assert(dataContext.count === 1, 'value should be incremented:' + dataContext.count);
    });

    it('should increment when method is invoked and not revert', function () {
      oig.evaluate(dataContext, 'increment()');
      assert(dataContext.count === 1, 'value should be incremented:' + dataContext.count);
    });
  });

});
