var oig;
(function (oig) {

  // DUMMY IMPLEMENTATION JUST TO GET IT TO WORK

  'use strict';
  oig.resource = function (url) {
    return {
      load: function () {

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest;
          xhr.open('GET', url, true);
          xhr.onload = function () {
            resolve(xhr.responseText);
          };
          xhr.send(null);
        });
      }
    };
  };
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
