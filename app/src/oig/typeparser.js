'use strict';

var oigTypeParserRegExInject = /inject\:\s*(.*)?\s*args\:\(([^)]+)\)/m;
var oigTypeParserRegExFnSplit = /\s*,\s*/;
/**
 * @param {Function} type
 * @returns {Object}
 */
function oigParseType(type) {

  return Object.create(null, {
      annotations: {
        get: function () {
          var annotationProcessor = oigLocator.resolve('oigAnnotationParser'),
            signature = type.toString(),
            value = [];
          if (oigTypeParserRegExInject.test(signature)) {
            var annotations = RegExp.$1.split(oigTypeParserRegExFnSplit);
            value = annotations.map(function (/**String*/annotation) {
              return annotationProcessor.parse(annotation.trim());
            });
            return value;
          }
        }
      },
      arguments: {
        get: function () {
          var signature = type.toString(),
            value = [];
          if (oigTypeParserRegExInject.test(signature)) {
            var args = RegExp.$2.split(oigTypeParserRegExFnSplit);
            value = args.map(function (/**String*/arg) {
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
 */
function OigTypeParser() {
}

OigTypeParser.prototype = {
  /**
   * @todo. Should be cached and not be parsed everytime on accessed
   * @param {Function} proto
   * @returns {Object}
   */
  parse: function (proto) {
    var typeInfo = Object.create(Object.prototype, {
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
        value: oigParseType(proto)
      },
      /**
       * returns map of type infos
       * no need to make this uglify save because
       * code will never  require to get methods by name, only by annotation
       * @returns {Object<String, Object>}
       */
      methods: {
        get: function () {
          var map = {},
            /**Function*/method,
            methods = proto.prototype;
          for (var i in methods) {
            if (typeof methods[i] === 'function') {
              method = methods[i];
              map[i] = oigParseType(method);
            }
          }
          return map;
        }
      }
    });
    return typeInfo;
  }
};
