var DataTransformer = require('./data-transforms/index');
var Totals = require('./totals/index');

function Aggregator () {
  if (!(this instanceof Aggregator)) return new Aggregator();
  this.dataTransformer = new DataTransformer();
  this.totalFunction = new Totals();
}

Aggregator.prototype = {
  setData: function (data) {
    this.data = data;
    this.totalFunction._setData(data);
    this.dataTransformer._setData(data);
    return this;
  },
  transform: function (transform) {
    return this.dataTransformer.transform.apply(this.dataTransformer, arguments);
  },
  totals: function () {
    return this.totalFunction;
  },
  modify: function () {
    return this.dataTransformer.modify();
  },
  process: function () {
    return this.totalFunction.process();
  }
};

module.exports = Aggregator;
