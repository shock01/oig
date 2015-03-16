// @todo change to class/prototype and use serviceLocator
'use strict';

/**
 *
 * @type {Object<String, Promise>}
 */
var resourceRequestMap = {};


/**
 * All reource requests should be of http method GET.
 *
 * @param url
 * @returns {{clear: Function, load: Function}}
 */
function oigResource(url) {
  return {
    /**
     * removes all loaded resources
     */
    clear: function () {
      resourceRequestMap = {};
    },
    /**
     * when no promise is created it will put a new promise in resourceRequestMap.
     * @returns {Promise}
     */
    load: function () {
      if (!(url in resourceRequestMap)) {
        resourceRequestMap[url] = new Promise(function (resolve, reject) {
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
      return resourceRequestMap[url];
    }
  };
};
