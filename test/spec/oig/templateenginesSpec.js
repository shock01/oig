describe('template engines', function () {

  var executor,
    template = '<%=TEMPLATE%>',
    data = {};


  before(function () {
    executor = sinon.stub();
    window.microtemplate = sinon.stub().returns(executor);
  });

  describe('default template engine', function () {
      it('should call microtemplating', function () {
        oig.templateEngines.default.compile(template, data);
        assert(window.microtemplate.calledWith(template),  'should call microtemplates with template arg');
        assert(executor.calledWith(data),  'should call executor with data');
      });
  });
})
