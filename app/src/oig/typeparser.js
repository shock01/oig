'use strict';
var oig;
(function(oig) {
  var TypeParserRegExFn = /function[^(]*\(([^)]*)\)/i,
    TypeParserRegExArgSplit = /\s*,\s*/;
  /**
   * @param {OigAnnotationParser} annotationParser
   * @param {Function} type
   * @returns {Object}
   */
  function parseType(annotationParser, type) {

    return Object.create(null, {
      arguments: {
        get: function() {
          var signature = type.toString(),
            value = [];
          if (TypeParserRegExFn.test(signature) && RegExp.$1.trim().length) {
            var args = RegExp.$1.split(TypeParserRegExArgSplit);
            value = args.map(function( /**String*/ arg) {
              return {
                name: arg
              };
            });
          }
          return value;
        }
      }
    });
  }

  /**
   * parses prototypes for arguments and annotations
   * uses syntax //# inject: @controller(test) args:(first, second) to make
   * sure comments are preserved when minified.
   * @constructor
   * @param {OigAnnotationParser} annotationParser
   */
  function TypeParser(annotationParser) {
    this.annotationParser = annotationParser;
  }

  TypeParser.prototype = {
    /**
     * @todo. Should be cached and not be parsed everytime on accessed
     * @param {Function} proto
     * @returns {Object}
     */
    parse: function(proto) {
      var annotationParser = this.annotationParser,
        typeInfo = Object.create(Object.prototype, {
          /**
           * reference to the proto(type)
           */
          type: {
            value: proto
          },
          /**
           * constructor typeInfo
           */
          constructorType: {
            value: parseType(annotationParser, proto)
          },
          /**
           * returns map of type infos
           * @returns {Object<String, Object>}
           */
          methods: {
            get: function() {
              var map = {},
                i,
                t,
                methods = proto.prototype;
              for (i in methods) {
                t = methods[i];
                if (typeof t === 'function') {
                  map[i] = parseType(annotationParser, t);
                }
              }
              return map;
            }
          }
        });
      return typeInfo;
    }
  };
  oig.TypeParser = TypeParser;
}(oig || (oig = {})));
