/*jslint node: true */
/*jshint laxbreak: true */
"use strict";

var MakeRequest = function() {
    return {
        makeRequest: function() {
          return fetch("http://httpbin.org/get").then(function(response) {
            return response.json();
          });
        }
    };
}();

module.exports = MakeRequest;