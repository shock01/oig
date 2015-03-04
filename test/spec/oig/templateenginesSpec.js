describe('template engines', function () {

  'use strict';

  /**
   * @type {Spy}
   */
  var executor;
  /**
   * @type {String}
   */
  var template = '<%=TEMPLATE%>';
  /**
   * @type {Object}
   */
  var data = {};


  before(function () {
    executor = sinon.stub();
    window.microtemplate = sinon.stub().returns(executor);
  });

  describe('default template engine', function () {
    it('should call microtemplating', function () {
      oig.templateEngines.default.compile(template, data);
      assert(window.microtemplate.calledWith(template), 'should call microtemplates with template arg');
      assert(executor.calledWith(data), 'should call executor with data');
    });
  });
});
