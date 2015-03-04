'use strict';

/**
 *
 * @type {Object<String, Promise>}
 */
var resource_requestMap = {};


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
      resource_requestMap = {};
    },
    /**
     * when no promise is created it will put a new promise in resource_requestMap.
     * @returns {Promise}
     */
    load: function () {
      if (!(url in resource_requestMap)) {
        resource_requestMap[url] = new Promise(function (resolve, reject) {
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
      return resource_requestMap[url];
    }
  };
};
