'use strict';

function OigResource() {
  /**
   *
   * @type {Object<String, Promise>}
   */
  this.resourceRequestMap = {};
}

OigResource.prototype = {
  /**
   * removes all loaded resources
   */
  clear: function () {
    this.resourceRequestMap = {};
  },
  /**
   * when no promise is created it will put a new promise in resourceRequestMap.
   * @returns {Promise}
   */
  load: function (url) {
    var resourceRequestMap = this.resourceRequestMap,
      /**
       * @type {XMLHttpRequest}
       */
      xhr;
    if (!(url in resourceRequestMap)) {
      resourceRequestMap[url] = new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.responseText || xhr.statusText);
          }
        };
        xhr.onerror = function () {
          reject('network error');
        };
        xhr.send(null);
      });
    }
    return resourceRequestMap[url];
  }
};
