describe('appcontext', function () {
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

    it('should not notify on same value', function (done) {
      var change;
      Object.observe(dataContext, function (changes) {
        change = changes[0];
      }, ['oig-eval-update']);
      oig.evaluate(dataContext, 'name = "john doe"');
      assert(!change, 'change should not be notified');
      setTimeout(function () {
        assert(!change, 'change should not be notified');
        done();
      }, 500);
    });

    it('should notify on change', function (done) {
      var change;
      Object.observe(dataContext, function (changes) {
        change = changes[0];
        assert(change, 'no change notified');
        assert(change.type === 'oig-eval-update');
        assert(change.changes[0].change === 'name', 'name of change incorrect');
        assert(change.changes[0].oldValue === 'john doe', 'old value incorrect');
        assert(change.changes[0].newValue === 'james doe', 'new value incorrect');
        done();
      }, ['oig-eval-update']);
      oig.evaluate(dataContext, 'name = "james doe"');
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
