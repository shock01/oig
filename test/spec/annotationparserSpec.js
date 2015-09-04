describe('annotationparser', function() {
  'use strict';
  /**
   * @type {OigAnnotationParser}
   */
  var annotationParser;
  beforeEach(function() {
    annotationParser = new OigAnnotationParser();
  });

  it('should throw on invalid signature', function() {
    expect(function() {
      annotationParser.parse('test');
    }).to.throw('[oig:annotationparser] invalid annotation: test');
  });

  it('have a type', function() {
    var annotation = annotationParser.parse('@test');
    assert.equal(annotation.annotationType, 'test');
  });

  it('have properties', function() {
    var annotation = annotationParser.parse('@test(value = 1, name = "Hello world")');
    assert.equal(annotation.value, 1);
    assert.equal(annotation.name, 'Hello world');
    annotation = annotationParser.parse('@test(1)');
    assert.equal(annotation.value, 1);
  });
});
