"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * class representing a version of a model
 * @class
 */
var ModelVersion = function ModelVersion(_config, data) {
  _classCallCheck(this, ModelVersion);

  this.id = data.id;
  this.created_at = this.createdAt = data.created_at || data.createdAt;
  this.status = data.status;
  this.active_concept_count = data.active_concept_count;
  this.metrics = data.metrics;
  this._config = _config;
  this.rawData = data;
};

;

module.exports = ModelVersion;