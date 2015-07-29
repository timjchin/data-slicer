var DataTransformer = require('./data-transforms/index');
var Totals = require('./totals/index');

function Aggregator (opts) {
  this.opts = opts || {};
  this.dataTransformer = new DataTransformer();
  this.totalFunction = new Totals();
}

Aggregator.prototype = {
  setData: function (data) {
    this.data = data;
    this.totalFunction._setData(data);
    this.dataTransformer._setData(data);
  },
  transform: function (transform) {
    return this.dataTransformer.transform.apply(this.dataTransformer, arguments);
  },
  totals: function () {
    return this.totalFunction;
  }
};

module.exports = Aggregator;
