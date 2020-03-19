'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Moderation = require('./Moderation');

var Solutions = function Solutions(_config) {
  _classCallCheck(this, Solutions);

  this.moderation = new Moderation(_config);
};

module.exports = Solutions;