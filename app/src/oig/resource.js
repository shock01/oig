var oig;
(function (oig) {

  'use strict';

  /**
   *
   * @type {Object<String, Promise>}
   */
  var requestMap = {};


  /**
   * All reource requests should be of http method GET.
   *
   * @param url
   * @returns {{clear: Function, load: Function}}
   */
  oig.resource = function (url) {
    return {
      /**
       * removes all loaded resources
       */
      clear: function () {
        requestMap = {};
      },
      /**
       * when no promise is created it will put a new promise in requestMap.
       * @returns {Promise}
       */
      load: function () {
        if (!(url in requestMap)) {
          requestMap[url] = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = function () {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
              } else {
                reject(xhr.responseText);
              }
            };
            xhr.send(null);
          });
        }
        return requestMap[url];
      }
    };
  };
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
