'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');

var _require = require('./constants'),
    API = _require.API,
    replaceVars = _require.replaceVars;

var WORKFLOWS_PATH = API.WORKFLOWS_PATH,
    WORKFLOW_PATH = API.WORKFLOW_PATH,
    WORKFLOW_RESULTS_PATH = API.WORKFLOW_RESULTS_PATH;

var _require2 = require('./utils'),
    wrapToken = _require2.wrapToken,
    formatInput = _require2.formatInput;

var _require3 = require('./helpers'),
    checkType = _require3.checkType;

/**
 * class representing a workflow
 * @class
 */


var Workflow = function () {
  function Workflow(_config) {
    var rawData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Workflow);

    this._config = _config;
    this.rawData = rawData;
    this.id = rawData.id;
    this.createdAt = rawData.created_at || rawData.createdAt;
    this.appId = rawData.app_id || rawData.appId;
  }

  /**
   * @deprecated
   */


  _createClass(Workflow, [{
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

    /**
     * @deprecated
     */

  }, {
    key: 'delete',
    value: function _delete(workflowId, config) {
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

    /**
     * Returns workflow output according to inputs
     * @param {string}                   workflowId    Workflow id
     * @param {object[]|object|string}   inputs    An array of objects/object/string pointing to an image resource. A string can either be a url or base64 image bytes. Object keys explained below:
     *    @param {object}                  inputs[].image     Object with keys explained below:
     *       @param {string}                 inputs[].image.(url|base64)  Can be a publicly accessibly url or base64 string representing image bytes (required)
     * @param {object} config An object with keys explained below.
     *   @param {float} config.minValue The minimum confidence threshold that a result must meet. From 0.0 to 1.0
     *   @param {number} config.maxConcepts The maximum number of concepts to return
     */

  }, {
    key: 'predict',
    value: function predict(workflowId, inputs) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var url = '' + this._config.basePath + replaceVars(WORKFLOW_RESULTS_PATH, [workflowId]);
      if (checkType(/(Object|String)/, inputs)) {
        inputs = [inputs];
      }
      return wrapToken(this._config, function (headers) {
        var params = {
          inputs: inputs.map(formatInput)
        };
        if (config && Object.getOwnPropertyNames(config).length > 0) {
          params['output_config'] = (0, _utils.formatObjectForSnakeCase)(config);
        }
        return new Promise(function (resolve, reject) {
          axios.post(url, params, {
            headers: headers
          }).then(function (response) {
            var data = response.data;
            resolve(data);
          }, reject);
        });
      });
    }
  }]);

  return Workflow;
}();

module.exports = Workflow;