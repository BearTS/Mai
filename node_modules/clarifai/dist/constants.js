'use strict';

var MAX_BATCH_SIZE = 128;
var GEO_LIMIT_TYPES = ['withinMiles', 'withinKilometers', 'withinRadians', 'withinDegrees'];
var SYNC_TIMEOUT = 360000; // 6 minutes
var MODEL_QUEUED_FOR_TRAINING = '21103';
var MODEL_TRAINING = '21101';
var POLLTIME = 2000;

module.exports = {
  API: {
    TOKEN_PATH: '/token',
    MODELS_PATH: '/models',
    MODEL_PATH: '/models/$0',
    MODEL_VERSIONS_PATH: '/models/$0/versions',
    MODEL_VERSION_PATH: '/models/$0/versions/$1',
    MODEL_PATCH_PATH: '/models/$0/output_info/data/concepts',
    MODEL_OUTPUT_PATH: '/models/$0/output_info',
    MODEL_VERSION_OUTPUT_PATH: '/models/$0/versions/$1/output_info',
    MODEL_SEARCH_PATH: '/models/searches',
    MODEL_FEEDBACK_PATH: '/models/$0/feedback',
    MODEL_VERSION_FEEDBACK_PATH: '/models/$0/versions/$1/feedback',
    PREDICT_PATH: '/models/$0/outputs',
    VERSION_PREDICT_PATH: '/models/$0/versions/$1/outputs',
    CONCEPTS_PATH: '/concepts',
    CONCEPT_PATH: '/concepts/$0',
    CONCEPT_SEARCH_PATH: '/concepts/searches',
    MODEL_INPUTS_PATH: '/models/$0/inputs',
    MODEL_VERSION_INPUTS_PATH: '/models/$0/versions/$1/inputs',
    MODEL_VERSION_METRICS_PATH: '/models/$0/versions/$1/metrics',
    INPUTS_PATH: '/inputs',
    INPUT_PATH: '/inputs/$0',
    INPUTS_STATUS_PATH: '/inputs/status',
    SEARCH_PATH: '/searches',
    SEARCH_FEEDBACK_PATH: '/searches/feedback',
    WORKFLOWS_PATH: '/workflows',
    WORKFLOW_PATH: '/workflows/$0',
    WORKFLOW_RESULTS_PATH: '/workflows/$0/results'
  },
  ERRORS: {
    paramsRequired: function paramsRequired(param) {
      var paramList = Array.isArray(param) ? param : [param];
      return new Error('The following ' + (paramList.length > 1 ? 'params are' : 'param is') + ' required: ' + paramList.join(', '));
    },
    MAX_INPUTS: new Error('Number of inputs passed exceeded max of ' + MAX_BATCH_SIZE),
    INVALID_GEOLIMIT_TYPE: new Error('Incorrect geo_limit type. Value must be any of the following: ' + GEO_LIMIT_TYPES.join(', ')),
    INVALID_DELETE_ARGS: new Error('Wrong arguments passed. You can only delete all models (provide no arguments), delete select models (provide list of ids),\n    delete a single model (providing a single id) or delete a model version (provide a single id and version id)')
  },
  STATUS: {
    MODEL_QUEUED_FOR_TRAINING: MODEL_QUEUED_FOR_TRAINING,
    MODEL_TRAINING: MODEL_TRAINING
  },
  // var replacement must be given in order
  replaceVars: function replaceVars(path) {
    var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var newPath = path;
    vars.forEach(function (val, index) {
      if (index === 0) {
        val = encodeURIComponent(val);
      }
      newPath = newPath.replace(new RegExp('\\$' + index, 'g'), val);
    });
    return newPath;
  },
  getBasePath: function getBasePath() {
    var apiEndpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'https://api.clarifai.com';
    var userId = arguments[1];
    var appId = arguments[2];

    if (!userId || !appId) {
      return apiEndpoint + '/v2';
    }
    return apiEndpoint + '/v2/users/' + userId + '/apps/' + appId;
  },
  GEO_LIMIT_TYPES: GEO_LIMIT_TYPES,
  MAX_BATCH_SIZE: MAX_BATCH_SIZE,
  SYNC_TIMEOUT: SYNC_TIMEOUT,
  POLLTIME: POLLTIME
};