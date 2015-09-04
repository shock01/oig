'use strict';
var oigAnnotationParserRegExAnnotation = /^@([^\s(]+)\s*(?:\(([^)]+)\))?$/;
var oigAnnotationParserRegExValue = /^\s*(?:["'])?(.+(?=["']$))(?:["'])\s*$/;
var oigAnnotationParserRegExFnSplit = /\s*,\s*/;

var OigAnnotation = Object.create(Object.prototype);
/**
 *
 * @constructor
 */
function OigAnnotationParser() {
}


OigAnnotationParser.prototype = {
  /**
   * @param {String} signature
   * @return {Object}
   */
  parse: function (signature) {

    if (!oigAnnotationParserRegExAnnotation.test(signature)) {
      throw '[oig:annotationparser] invalid annotation: ' + signature;
    }
    var annotation = Object.create(OigAnnotation, {
        annotationType: {
          value: RegExp.$1
        }
      }),
      values = RegExp.$2.length ? RegExp.$2.split(oigAnnotationParserRegExFnSplit) : null;

    if (values !== null) {
      /**
       * default property can have no key value pair
       */
      if (values.length === 1 && values[0].indexOf('=') < 0) {
        Object.defineProperty(annotation, 'value', {
          value: values[0].replace(oigAnnotationParserRegExValue, '$1').trim()
        });
      } else {
        values.forEach(function (/**String*/str) {
          var pair = str.split('='),
            /**String*/key,
            /**String*/value;

          key = pair[0].replace(oigAnnotationParserRegExValue, '$1').trim();
          value = pair[1].replace(oigAnnotationParserRegExValue, '$1').trim();
          Object.defineProperty(annotation, key, {
            value: value
          });
        });
      }
    }
    // annotations are immutable
    Object.freeze(annotation);
    return annotation;
  }
};
