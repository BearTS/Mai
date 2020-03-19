'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');

var _require = require('../utils'),
    wrapToken = _require.wrapToken;

var _require2 = require('../helpers'),
    isSuccess = _require2.isSuccess,
    clone = _require2.clone;

var BASE_URL = 'https://api.clarifai-moderation.com';

var Moderation = function () {
  function Moderation(_config) {
    _classCallCheck(this, Moderation);

    this._config = _config;
  }

  _createClass(Moderation, [{
    key: 'predict',
    value: function predict(modelID, imageURL) {
      return wrapToken(this._config, function (headers) {
        var url = BASE_URL + '/v2/models/' + modelID + '/outputs';
        var params = {
          inputs: [{
            data: {
              image: {
                url: imageURL
              }
            }
          }]
        };

        return new Promise(function (resolve, reject) {
          return axios.post(url, params, { headers: headers }).then(function (response) {
            if (isSuccess(response)) {
              var data = clone(response.data);
              resolve(data);
            } else {
              reject(response);
            }
          }, reject);
        });
      });
    }
  }, {
    key: 'getModerationStatus',
    value: function getModerationStatus(imageID) {
      return wrapToken(this._config, function (headers) {
        var url = BASE_URL + '/v2/inputs/' + imageID + '/outputs';
        return new Promise(function (resolve, reject) {
          return axios.get(url, { headers: headers }).then(function (response) {
            var data = clone(response.data);
            resolve(data);
          }, reject);
        });
      });
    }
  }]);

  return Moderation;
}();

module.exports = Moderation;