'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');

var _require = require('./helpers'),
    checkType = _require.checkType;

var Models = require('./Models');
var Inputs = require('./Inputs');
var Concepts = require('./Concepts');
var Workflow = require('./Workflow');
var Workflows = require('./Workflows');
var Solutions = require('./solutions/Solutions');

var _require2 = require('./constants'),
    API = _require2.API,
    ERRORS = _require2.ERRORS,
    getBasePath = _require2.getBasePath;

var TOKEN_PATH = API.TOKEN_PATH;


if (typeof window !== 'undefined' && !('Promise' in window)) {
  window.Promise = require('promise');
}

if (typeof global !== 'undefined' && !('Promise' in global)) {
  global.Promise = require('promise');
}

/**
 * top-level class that allows access to models, inputs and concepts
 * @class
 */

var App = function () {
  function App(arg1, arg2, arg3) {
    _classCallCheck(this, App);

    var optionsObj = arg1;
    if ((typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1)) !== 'object' || arg1 === null) {
      optionsObj = arg3 || {};
      optionsObj.clientId = arg1;
      optionsObj.clientSecret = arg2;
    }
    this._validate(optionsObj);
    this._init(optionsObj);
  }

  /**
   * Gets a token from the API using client credentials
   * @return {Promise(token, error)} A Promise that is fulfilled with the token string or rejected with an error
   *
   * @deprecated Please switch to using the API key.
   */


  _createClass(App, [{
    key: 'getToken',
    value: function getToken() {
      return this._config.token();
    }

    /**
     * Sets the token to use for the API
     * @param {String}         _token    The token you are setting
     * @return {Boolean}                 true if token has valid fields, false if not
     *
     * @deprecated Please switch to using the API key.
     */

  }, {
    key: 'setToken',
    value: function setToken(_token) {
      var token = _token;
      var now = new Date().getTime();
      if (typeof _token === 'string') {
        token = {
          accessToken: _token,
          expiresIn: 176400
        };
      } else {
        token = {
          accessToken: _token.access_token || _token.accessToken,
          expiresIn: _token.expires_in || _token.expiresIn
        };
      }
      if (token.accessToken && token.expiresIn || token.access_token && token.expires_in) {
        if (!token.expireTime) {
          token.expireTime = now + token.expiresIn * 1000;
        }
        this._config._token = token;
        return true;
      }
      return false;
    }
  }, {
    key: '_validate',
    value: function _validate(_ref) {
      var clientId = _ref.clientId,
          clientSecret = _ref.clientSecret,
          token = _ref.token,
          apiKey = _ref.apiKey,
          sessionToken = _ref.sessionToken;

      if (clientId || clientSecret) {
        console.warn('Client ID/secret has been deprecated. Please switch to using the API key. See here how to do ' + 'the switch: https://blog.clarifai.com/introducing-api-keys-a-safer-way-to-authenticate-your-applications');
      }
      if ((!clientId || !clientSecret) && !token && !apiKey && !sessionToken) {
        throw ERRORS.paramsRequired(['apiKey']);
      }
    }
  }, {
    key: '_init',
    value: function _init(options) {
      var _this = this;

      var apiEndpoint = options.apiEndpoint || process && process.env && process.env.API_ENDPOINT || 'https://api.clarifai.com';
      this._config = {
        apiEndpoint: apiEndpoint,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        apiKey: options.apiKey,
        sessionToken: options.sessionToken,
        basePath: getBasePath(apiEndpoint, options.userId, options.appId),
        token: function token() {
          return new Promise(function (resolve, reject) {
            var now = new Date().getTime();
            if (checkType(/Object/, _this._config._token) && _this._config._token.expireTime > now) {
              resolve(_this._config._token);
            } else {
              _this._getToken(resolve, reject);
            }
          });
        }
      };
      if (options.token) {
        this.setToken(options.token);
      }
      this.models = new Models(this._config);
      this.inputs = new Inputs(this._config);
      this.concepts = new Concepts(this._config);
      this.workflow = new Workflow(this._config);
      this.workflows = new Workflows(this._config);
      this.solutions = new Solutions(this._config);
    }

    /**
     * @deprecated Please switch to using the API key.
     */

  }, {
    key: '_getToken',
    value: function _getToken(resolve, reject) {
      var _this2 = this;

      this._requestToken().then(function (response) {
        if (response.status === 200) {
          _this2.setToken(response.data);
          resolve(_this2._config._token);
        } else {
          reject(response);
        }
      }, reject);
    }

    /**
     * @deprecated Please switch to using the API key.
     */

  }, {
    key: '_requestToken',
    value: function _requestToken() {
      var url = '' + this._config.basePath + TOKEN_PATH;
      var clientId = this._config.clientId;
      var clientSecret = this._config.clientSecret;
      return axios({
        'url': url,
        'method': 'POST',
        'auth': {
          'username': clientId,
          'password': clientSecret
        }
      });
    }
  }]);

  return App;
}();

module.exports = App;