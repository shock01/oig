describe('evaluate', function() {

  // @todo use promises as in ifelementSpec

  'use strict';
  /**
   * @type {Object}
   */
  var dataContext;

  beforeEach(function() {
    dataContext = {
      name: 'john doe',
      count: 0,
      increment: function() {
        this.count++;
      }
    };
  });

  describe('evaluate', function() {
    it('should return name', function() {
      assert(oigEvaluate(dataContext, 'name') === dataContext.name, 'name should be evaluated');
    });

    it('should assign name', function() {
      oigEvaluate(dataContext, 'name = "james doe"');
      assert('james doe' === dataContext.name, 'name should be evaluated');
    });

    it('should increment when method is invoked on viewModel', function() {
      oigEvaluate(dataContext, 'increment()');
      assert(dataContext.count === 1, 'value should be incremented:' + dataContext.count);
    });

    it('should increment when method is invoked and not revert', function() {
      oigEvaluate(dataContext, 'increment()');
      assert(dataContext.count === 1, 'value should be incremented:' + dataContext.count);
    });
  });

});
