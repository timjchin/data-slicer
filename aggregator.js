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
  processChunk: function(data) {
    this.setData(data);
    this.modify();
    if (!this._tempData) {
      this._tempData = true;
    }
    this._tempData = this.totalFunction.process(this._tempData);
    return this;
  },
  chunksComplete: function () {
    this.totalFunction._postProcess(this._tempData.outData, this._tempData.toPostProcess);
    this.totalFunction._sortData(this._tempData.toSort);
    this.totalFunction.reset();
    var out = this._tempData.outData;
    this._tempData = undefined;
    return out;
  },
  modify: function () {
    return this.dataTransformer.modify();
  },
  process: function () {
    return this.totalFunction.process();
  }
};

module.exports = Aggregator;
