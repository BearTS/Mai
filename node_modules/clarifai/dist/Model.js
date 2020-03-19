'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios');
var ModelVersion = require('./ModelVersion');

var _require = require('./helpers'),
    isSuccess = _require.isSuccess,
    checkType = _require.checkType,
    clone = _require.clone;

var _require2 = require('./constants'),
    API = _require2.API,
    SYNC_TIMEOUT = _require2.SYNC_TIMEOUT,
    replaceVars = _require2.replaceVars,
    STATUS = _require2.STATUS,
    POLLTIME = _require2.POLLTIME;

var MODEL_QUEUED_FOR_TRAINING = STATUS.MODEL_QUEUED_FOR_TRAINING,
    MODEL_TRAINING = STATUS.MODEL_TRAINING;

var _require3 = require('./utils'),
    wrapToken = _require3.wrapToken,
    formatMediaPredict = _require3.formatMediaPredict,
    formatModel = _require3.formatModel,
    formatObjectForSnakeCase = _require3.formatObjectForSnakeCase;

var MODEL_VERSIONS_PATH = API.MODEL_VERSIONS_PATH,
    MODEL_VERSION_PATH = API.MODEL_VERSION_PATH,
    MODELS_PATH = API.MODELS_PATH,
    MODEL_FEEDBACK_PATH = API.MODEL_FEEDBACK_PATH,
    MODEL_VERSION_FEEDBACK_PATH = API.MODEL_VERSION_FEEDBACK_PATH,
    PREDICT_PATH = API.PREDICT_PATH,
    VERSION_PREDICT_PATH = API.VERSION_PREDICT_PATH,
    MODEL_INPUTS_PATH = API.MODEL_INPUTS_PATH,
    MODEL_VERSION_OUTPUT_PATH = API.MODEL_VERSION_OUTPUT_PATH,
    MODEL_OUTPUT_PATH = API.MODEL_OUTPUT_PATH,
    MODEL_VERSION_INPUTS_PATH = API.MODEL_VERSION_INPUTS_PATH,
    MODEL_VERSION_METRICS_PATH = API.MODEL_VERSION_METRICS_PATH;

/**
 * class representing a model
 * @class
 */

var Model = function () {
  function Model(_config, data) {
    _classCallCheck(this, Model);

    this._config = _config;
    this.name = data.name;
    this.id = data.id;
    this.createdAt = data.created_at || data.createdAt;
    this.appId = data.app_id || data.appId;
    this.outputInfo = data.output_info || data.outputInfo;
    if (checkType(/(String)/, data.version)) {
      this.modelVersion = {};
      this.versionId = data.version;
    } else {
      if (data.model_version || data.modelVersion || data.version) {
        this.modelVersion = new ModelVersion(this._config, data.model_version || data.modelVersion || data.version);
      }
      this.versionId = (this.modelVersion || {}).id;
    }
    this.rawData = data;
  }

  /**
   * Merge concepts to a model
   * @param {object[]}      concepts    List of concept objects with id
   * @return {Promise(Model, error)} A Promise that is fulfilled with a Model instance or rejected with an error
   */


  _createClass(Model, [{
    key: 'mergeConcepts',
    value: function mergeConcepts() {
      var concepts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var conceptsArr = Array.isArray(concepts) ? concepts : [concepts];
      return this.update({ action: 'merge', concepts: conceptsArr });
    }

    /**
     * Remove concepts from a model
     * @param {object[]}      concepts    List of concept objects with id
     * @return {Promise(Model, error)} A Promise that is fulfilled with a Model instance or rejected with an error
     */

  }, {
    key: 'deleteConcepts',
    value: function deleteConcepts() {
      var concepts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var conceptsArr = Array.isArray(concepts) ? concepts : [concepts];
      return this.update({ action: 'remove', concepts: conceptsArr });
    }

    /**
     * Overwrite concepts in a model
     * @param {object[]}      concepts    List of concept objects with id
     * @return {Promise(Model, error)} A Promise that is fulfilled with a Model instance or rejected with an error
     */

  }, {
    key: 'overwriteConcepts',
    value: function overwriteConcepts() {
      var concepts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var conceptsArr = Array.isArray(concepts) ? concepts : [concepts];
      return this.update({ action: 'overwrite', concepts: conceptsArr });
    }

    /**
     * Start a model evaluation job
     * @return {Promise(ModelVersion, error)} A Promise that is fulfilled with a ModelVersion instance or rejected with an error
     */

  }, {
    key: 'runModelEval',
    value: function runModelEval() {
      var _this = this;

      var url = '' + this._config.basePath + replaceVars(MODEL_VERSION_METRICS_PATH, [this.id, this.versionId]);
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.post(url, {}, { headers: headers }).then(function (response) {
            if (isSuccess(response)) {
              resolve(new ModelVersion(_this._config, response.data.model_version));
            } else {
              reject(response);
            }
          }, reject);
        });
      });
    }

    /**
     * Update a model's output config or concepts
     * @param {object}               model                                 An object with any of the following attrs:
     *   @param {string}               name                                  The new name of the model to update with
     *   @param {boolean}              conceptsMutuallyExclusive             Do you expect to see more than one of the concepts in this model in the SAME image? Set to false (default) if so. Otherwise, set to true.
     *   @param {boolean}              closedEnvironment                     Do you expect to run the trained model on images that do not contain ANY of the concepts in the model? Set to false (default) if so. Otherwise, set to true.
     *   @param {object[]}             concepts                              An array of concept objects or string
     *     @param {object|string}        concepts[].concept                    If string is given, this is interpreted as concept id. Otherwise, if object is given, client expects the following attributes
     *       @param {string}             concepts[].concept.id                   The id of the concept to attach to the model
     *   @param {object[]}             action                                The action to perform on the given concepts. Possible values are 'merge', 'remove', or 'overwrite'. Default: 'merge'
     * @return {Promise(Model, error)} A Promise that is fulfilled with a Model instance or rejected with an error
     */

  }, {
    key: 'update',
    value: function update(obj) {
      var _this2 = this;

      var url = '' + this._config.basePath + MODELS_PATH;
      var modelData = [obj];
      var data = { models: modelData.map(function (m) {
          return formatModel(Object.assign(m, { id: _this2.id }));
        }) };
      if (Array.isArray(obj.concepts)) {
        data['action'] = obj.action || 'merge';
      }

      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.patch(url, data, { headers: headers }).then(function (response) {
            if (isSuccess(response)) {
              resolve(new Model(_this2._config, response.data.models[0]));
            } else {
              reject(response);
            }
          }, reject);
        });
      });
    }

    /**
     * Create a new model version
     * @param {boolean}       sync     If true, this returns after model has completely trained. If false, this immediately returns default api response.
     * @return {Promise(Model, error)} A Promise that is fulfilled with a Model instance or rejected with an error
     */

  }, {
    key: 'train',
    value: function train(sync) {
      var _this3 = this;

      var url = '' + this._config.basePath + replaceVars(MODEL_VERSIONS_PATH, [this.id]);
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.post(url, null, { headers: headers }).then(function (response) {
            if (isSuccess(response)) {
              // Training produces a new model version ID.
              _this3.versionId = response.data.model.model_version.id;

              if (sync) {
                var timeStart = Date.now();
                _this3._pollTrain.bind(_this3)(timeStart, resolve, reject);
              } else {
                resolve(new Model(_this3._config, response.data.model));
              }
            } else {
              reject(response);
            }
          }, reject);
        });
      });
    }
  }, {
    key: '_pollTrain',
    value: function _pollTrain(timeStart, resolve, reject) {
      var _this4 = this;

      clearTimeout(this.pollTimeout);
      if (Date.now() - timeStart >= SYNC_TIMEOUT) {
        return reject({
          status: 'Error',
          message: 'Sync call timed out'
        });
      }
      this.getOutputInfo().then(function (model) {
        var modelStatusCode = model.modelVersion.status.code.toString();
        if (modelStatusCode === MODEL_QUEUED_FOR_TRAINING || modelStatusCode === MODEL_TRAINING) {
          _this4.pollTimeout = setTimeout(function () {
            return _this4._pollTrain(timeStart, resolve, reject);
          }, POLLTIME);
        } else {
          resolve(model);
        }
      }, reject).catch(reject);
    }

    /**
     * Returns model ouputs according to inputs
     * @param {object[]|object|string}       inputs    An array of objects/object/string pointing to an image resource. A string can either be a url or base64 image bytes. Object keys explained below:
     *    @param {object}                      inputs[].image     Object with keys explained below:
     *       @param {string}                     inputs[].image.(url|base64)   Can be a publicly accessibly url or base64 string representing image bytes (required)
     *       @param {number[]}                   inputs[].image.crop           An array containing the percent to be cropped from top, left, bottom and right (optional)
     * @param {object|string} config An object with keys explained below. If a string is passed instead, it will be treated as the language (backwards compatibility)
     *   @param {string} config.language A string code representing the language to return results in (example: 'zh' for simplified Chinese, 'ru' for Russian, 'ja' for Japanese)
     *   @param {boolean} config.video indicates if the input should be processed as a video
     *   @param {object[]} config.selectConcepts An array of concepts to return. Each object in the array will have a form of {name: <CONCEPT_NAME>} or {id: CONCEPT_ID}
     *   @param {float} config.minValue The minimum confidence threshold that a result must meet. From 0.0 to 1.0
     *   @param {number} config.maxConcepts The maximum number of concepts to return
     * @param {boolean} isVideo  Deprecated: indicates if the input should be processed as a video (default false). Deprecated in favor of using config object
     * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */

  }, {
    key: 'predict',
    value: function predict(inputs) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var isVideo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (checkType(/String/, config)) {
        console.warn('passing the language as a string is deprecated, consider using the configuration object instead');
        config = {
          language: config
        };
      }

      if (isVideo) {
        console.warn('"isVideo" argument is deprecated, consider using the configuration object instead');
        config.video = isVideo;
      }
      var video = config.video || false;
      delete config.video;
      if (checkType(/(Object|String)/, inputs)) {
        inputs = [inputs];
      }
      var url = '' + this._config.basePath + (this.versionId ? replaceVars(VERSION_PREDICT_PATH, [this.id, this.versionId]) : replaceVars(PREDICT_PATH, [this.id]));
      return wrapToken(this._config, function (headers) {
        var params = { inputs: inputs.map(function (input) {
            return formatMediaPredict(input, video ? 'video' : 'image');
          }) };
        if (config && Object.getOwnPropertyNames(config).length > 0) {
          params['model'] = {
            output_info: {
              output_config: formatObjectForSnakeCase(config)
            }
          };
        }
        return new Promise(function (resolve, reject) {
          axios.post(url, params, { headers: headers }).then(function (response) {
            var data = clone(response.data);
            data.rawData = clone(response.data);
            resolve(data);
          }, reject);
        });
      });
    }

    /**
     * Returns a version of the model specified by its id
     * @param {string}     versionId   The model's id
     * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */

  }, {
    key: 'getVersion',
    value: function getVersion(versionId) {
      // TODO(Rok) MEDIUM: The version ID isn't URI encoded, as opposed to the model ID. This should probably be
      //  consistent - i.e. the same in both cases.
      var url = '' + this._config.basePath + replaceVars(MODEL_VERSION_PATH, [this.id, versionId]);
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.get(url, { headers: headers }).then(function (response) {
            var data = clone(response.data);
            data.rawData = clone(response.data);
            resolve(data);
          }, reject);
        });
      });
    }

    /**
     * Returns a list of versions of the model
     * @param {object}     options     Object with keys explained below: (optional)
     *   @param {number}     options.page        The page number (optional, default: 1)
     *   @param {number}     options.perPage     Number of images to return per page (optional, default: 20)
     * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */

  }, {
    key: 'getVersions',
    value: function getVersions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { page: 1, perPage: 20 };

      var url = '' + this._config.basePath + replaceVars(MODEL_VERSIONS_PATH, [this.id]);
      return wrapToken(this._config, function (headers) {
        var data = {
          headers: headers,
          params: { 'per_page': options.perPage, 'page': options.page }
        };
        return new Promise(function (resolve, reject) {
          axios.get(url, data).then(function (response) {
            var data = clone(response.data);
            data.rawData = clone(response.data);
            resolve(data);
          }, reject);
        });
      });
    }

    /**
     * Returns all the model's output info
     * @return {Promise(Model, error)} A Promise that is fulfilled with a Model instance or rejected with an error
     */

  }, {
    key: 'getOutputInfo',
    value: function getOutputInfo() {
      var _this5 = this;

      var url = '' + this._config.basePath + (this.versionId ? replaceVars(MODEL_VERSION_OUTPUT_PATH, [this.id, this.versionId]) : replaceVars(MODEL_OUTPUT_PATH, [this.id]));
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.get(url, { headers: headers }).then(function (response) {
            resolve(new Model(_this5._config, response.data.model));
          }, reject);
        });
      });
    }

    /**
     * Returns all the model's inputs
     * @param {object}     options     Object with keys explained below: (optional)
     *   @param {number}     options.page        The page number (optional, default: 1)
     *   @param {number}     options.perPage     Number of images to return per page (optional, default: 20)
     * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */

  }, {
    key: 'getInputs',
    value: function getInputs() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { page: 1, perPage: 20 };

      var url = '' + this._config.basePath + (this.versionId ? replaceVars(MODEL_VERSION_INPUTS_PATH, [this.id, this.versionId]) : replaceVars(MODEL_INPUTS_PATH, [this.id]));
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.get(url, {
            params: { 'per_page': options.perPage, 'page': options.page },
            headers: headers
          }).then(function (response) {
            var data = clone(response.data);
            data.rawData = clone(response.data);
            resolve(data);
          }, reject);
        });
      });
    }

    /**
     *
     * @param {string} input A string pointing to an image resource. A string must be a url
     * @param {object} config A configuration object consisting of the following required keys
     *   @param {string} config.id The id of the feedback request
     *   @param {object} config.data The feedback data to be sent
     *   @param {object} config.info Meta data related to the feedback request
     * @return {Promise(response, error)} A Promise that is fulfilled with the API response or rejected with an error
     */

  }, {
    key: 'feedback',
    value: function feedback(input, _ref) {
      var id = _ref.id,
          data = _ref.data,
          info = _ref.info;

      var url = '' + this._config.basePath + (this.versionId ? replaceVars(MODEL_VERSION_FEEDBACK_PATH, [this.id, this.versionId]) : replaceVars(MODEL_FEEDBACK_PATH, [this.id]));
      var media = formatMediaPredict(input).data;
      info.eventType = 'annotation';
      var body = {
        input: {
          id: id,
          data: Object.assign(media, data),
          'feedback_info': formatObjectForSnakeCase(info)
        }
      };
      return wrapToken(this._config, function (headers) {
        return new Promise(function (resolve, reject) {
          axios.post(url, body, {
            headers: headers
          }).then(function (_ref2) {
            var data = _ref2.data;

            var d = clone(data);
            d.rawData = clone(data);
            resolve(d);
          }, reject);
        });
      });
    }
  }]);

  return Model;
}();

module.exports = Model;