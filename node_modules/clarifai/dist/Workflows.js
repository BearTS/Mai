'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');
var Workflow = require('./Workflow');

var _require = require('./constants'),
    API = _require.API,
    replaceVars = _require.replaceVars;

var WORKFLOWS_PATH = API.WORKFLOWS_PATH,
    WORKFLOW_PATH = API.WORKFLOW_PATH;

var _require2 = require('./utils'),
    wrapToken = _require2.wrapToken;

var _require3 = require('./helpers'),
    isSuccess = _require3.isSuccess;

/**
 * class representing a collection of workflows
 * @class
 */


var Workflows = function () {
  function Workflows(_config) {
    var _this = this;

    var rawData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Workflows);

    this._config = _config;
    this.rawData = rawData;
    rawData.forEach(function (workflowData, index) {
      _this[index] = new Workflow(_this._config, workflowData);
    });
    this.length = rawData.length;
  }

  /**
   * Get all workflows in app
   * @param {Object}    options  Object with keys explained below: (optional)
   *   @param {Number}    options.page  The page number (optional, default: 1)
   *   @param {Number}    options.perPage  Number of images to return per page (optional, default: 20)
   * @return {Promise(Workflows, error)} A Promise that is fulfilled with an instance of Workflows or rejected with an error
   */


  _createClass(Workflows, [{
    key: 'list',
    value: function list() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { page: 1, perPage: 20 };

      var url = '' + this._config.basePath + WORKFLOWS_PATH;
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.get(url, {
            headers: headers,
            params: {
              page: options.page,
              per_page: options.perPage
            }
          }).then(function (response) {
            if (isSuccess(response)) {
              resolve(new Workflows(_this2._config, response.data.workflows));
            } else {
              reject(response);
            }
          }, reject);
        });
      });
    }
  }, {
    key: 'create',
    value: function create(workflowId, config) {
      var url = '' + this._config.basePath + WORKFLOWS_PATH;
      var modelId = config.modelId;
      var modelVersionId = config.modelVersionId;
      var body = {
        workflows: [{
          id: workflowId,
          nodes: [{
            id: 'concepts',
            model: {
              id: modelId,
              model_version: {
                id: modelVersionId
              }
            }
          }]
        }]
      };

      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.post(url, body, {
            headers: headers
          }).then(function (response) {
            var workflowId = response.data.workflows[0].id;
            resolve(workflowId);
          }, reject);
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(workflowId) {
      var url = '' + this._config.basePath + replaceVars(WORKFLOW_PATH, [workflowId]);
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.delete(url, {
            headers: headers
          }).then(function (response) {
            var data = response.data;
            resolve(data);
          }, reject);
        });
      });
    }
  }]);

  return Workflows;
}();

;

module.exports = Workflows;