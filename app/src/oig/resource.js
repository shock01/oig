var oig;
(function (oig) {

  // DUMMY IMPLEMENTATION JUST TO GET IT TO WORK

  'use strict';
  oig.resource = function (url) {
    return {
      load: function () {

        return new Promise(function (resolve, reject) {
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
    };
  };
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
