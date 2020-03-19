'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Region = require('./Region');

/**
 * A collection of regions.
 * @class
 */

var Regions = function () {
  function Regions(_config) {
    var _this = this;

    var rawData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Regions);

    this._config = _config;
    this.rawData = rawData;
    rawData.forEach(function (regionData, index) {
      _this[index] = new Region(_this._config, regionData);
    });
    this.length = rawData.length;
  }

  _createClass(Regions, [{
    key: Symbol.iterator,
    value: function value() {
      var _this2 = this;

      var index = -1;
      return {
        next: function next() {
          return { value: _this2[++index], done: index >= _this2.length };
        }
      };
    }
  }]);

  return Regions;
}();

module.exports = Regions;