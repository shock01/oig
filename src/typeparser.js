/*exported OigTypeParser */
'use strict';

var oigTypeParserRegExInject = /inject\:\s*(.*)?\s*args\:\(([^)]+)\)/m;
var oigTypeParserRegExFnSplit = /\s*,\s*/;
/**
 * @param {OigAnnotationParser} annotationParser
 * @param {Function} type
 * @returns {Object}
 */
function oigParseType(annotationParser, type) {

  return Object.create(null, {
    annotations: {
      get: function() {
        var signature = type.toString(),
          value = [];
        if (oigTypeParserRegExInject.test(signature)) {
          var annotations = RegExp.$1.split(oigTypeParserRegExFnSplit);
          value = annotations.map(function( /**String*/ annotation) {
            return annotationParser.parse(annotation.trim());
          });
          return value;
        }
      }
    },
    arguments: {
      get: function() {
        var signature = type.toString(),
          value = [];
        if (oigTypeParserRegExInject.test(signature)) {
          var args = RegExp.$2.split(oigTypeParserRegExFnSplit);
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
function OigTypeParser(annotationParser) {
  this.annotationParser = annotationParser;
}

OigTypeParser.prototype = {
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
          value: oigParseType(annotationParser, proto)
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
                map[i] = oigParseType(annotationParser, t);
              }
            }
            return map;
          }
        }
      });
    return typeInfo;
  }
};
