describe('typeinfo', function () {
  'use strict';
  /**
   * @type {OigTypeParser}
   */
  var typeParser;
  /**
   * @type {OigAnnotationParser}
   */
  var annotationParser;
  /**
   * @type {OigTypeInfo}
   */
  var typeInfo;
  /**
   *
   */
  var annotation;

  var sandbox;

  /**
   *
   * @param first
   * @param second
   * @constructor
   */
  function Proto(first, second) {
    //# inject: @controller(test) args:(first, second)
    this.first = first;
    this.second = second;
  }

  Proto.prototype = {
    methodA: function (name) {
        //# inject: @service args:(name)
    }
  };

  /**
   * an instance of Functional is actually needed to parse the annotations...
   * which kinda sucks
   *
   * @param first
   * @param second
   * @constructor
   */
  function Functional(first, second) {
    //# inject: @controller(test) args:(first, second)
    this.methodA = function(name) {
      //# inject: @service args:(name)
    };
  }

  beforeEach(function () {
    typeParser = new OigTypeParser();
    annotationParser = oigLocator.resolve('oigAnnotationParser');
    annotation = {};
    // sandbox
    sandbox = sinon.sandbox.create();
    sandbox.stub(annotationParser, 'parse').returns(annotation);
  });

  afterEach(function () {
    sandbox.restore();
  });

  [Proto/*, Functional*/].forEach(function (Type, index) {
    describe('parsing type:' + index, function () {
      beforeEach(function () {
        typeInfo = typeParser.parse(Type);
      });

      it('should have a type', function () {
        expect(typeInfo.type).to.equal(Type);
      });

      describe('constructorType', function () {
        it('should have a constructor type', function () {
          assert(typeInfo.constructorType, 'constructorType not defined');
        });

        it('should have 1 annotation', function () {
          var annotations = typeInfo.constructorType.annotations;
          assert(annotationParser.parse.calledWith('@controller(test)'), 'annotationParser not called');
          assert.equal(annotations.length, 1);
          assert.equal(annotations[0], annotation);
        });

        it('should have 2 arguments', function () {
          assert.equal(typeInfo.constructorType.arguments.length, 2);
          assert.equal(typeInfo.constructorType.arguments[0].name, 'first');
          assert.equal(typeInfo.constructorType.arguments[1].name, 'second');
        });
      });

      describe('methodType', function () {
        it('should have a method type', function () {
          assert(typeInfo.methods.methodA, 'methodType not defined');
        });

        it('should have 1 annotation', function () {
          var annotations = typeInfo.methods.methodA.annotations;
          assert(annotationParser.parse.calledWith('@service'), 'annotationParser not called');
          assert.equal(annotations.length, 1);
          assert.equal(annotations[0], annotation);
        });
      });
    });
  });
});
