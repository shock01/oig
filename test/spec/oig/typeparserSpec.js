describe('typeparse', function() {
  'use strict';
  var typeParser;
  var typeInfo;
  /**
   *
   * @param first
   * @param second
   * @constructor
   */
  function Proto(first, second) {
    this.first = first;
    this.second = second;
  }

  Proto.prototype = {
    methodA: function(name) {
      return name;
    }
  };


  beforeEach(function() {
    typeParser = new oig.TypeParser();
  });


  [Proto /*, Functional*/ ].forEach(function(Type, index) {
    describe('parsing type:' + index, function() {
      beforeEach(function() {
        typeInfo = typeParser.parse(Type);
      });

      it('should have a type', function() {
        expect(typeInfo.type).toEqual(Type);
      });

      describe('constructorType', function() {
        it('should have a constructor type', function() {
          expect(typeInfo.constructorType).toBeDefined();
        });

        it('should have 2 arguments', function() {
          expect(typeInfo.constructorType.arguments.length).toEqual(2);
          expect(typeInfo.constructorType.arguments[0].name).toEqual('first');
          expect(typeInfo.constructorType.arguments[1].name).toEqual('second');
        });
      });

      describe('methodType', function() {
        it('should have a method type', function() {
          expect(typeInfo.methods.methodA).toBeDefined();
        });
      });
    });
  });
});