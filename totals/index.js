/**   dataMap = {
  *     aggregations: [
  *       {
  *         dataObject: function () {},
  *         field: 'fieldname'
  *       }
  *     ],
  *     sortBy: function () {
  *       
  *     },
  *     nested: {
  *       field: 'field',
  *       aggregations: []
  *     }
  *   };
  */
function Totals(opts) {
  this._uniqueBy = []; 
  this._fns = [];

  this._outDataFormat = {
    aggregations: [],
    sortBy: undefined,
    nested: undefined
  };

  this._currentNestedLevel = this._outDataFormat;

  for (var key in Totals.functions) { 
    this[key] = function (key, field) {
      this._fns.push({ 
        dataObject: Totals.functions[key],
        field: field
      });
      return this;
    }.bind(this, key);
  }
}

Totals.functions = { 
  count: require('./count'),
  mean: require('./mean'),
  min: require('./min'),
  max: require('./max'),
  total: require('./total')
};


Totals.prototype = {
  _setData: function (data) {
    this.data = data;
  },
  uniqueBy: function (field) {
    this._uniqueBy = field;
    return this;
  },
  process: function () {
    if (this._uniqueBy) { 
      this._processUniques();
    } else {
      this._processSet(this.data);
    }
  },

  _processUniques: function () {
    var uniqueAggs = {};

    for (var i = 0; i < this.data.length; i++) { 
      var record = this.data[i];
      var uniqueValue = record[this._uniqueBy];
      if (!uniqueAggs[uniqueValue]) {
        uniqueAggs[uniqueValue] = this._initDataSet();
      }
      var uniqueDataSet = uniqueAggs[uniqueValue];
      this._processDataSet(uniqueDataSet, record);
    }

    var outData = {};
    for (var key in uniqueAggs) {
      this._postProcessDataSet(uniqueAggs[key])
      outData[key] = this._generateSetData(uniqueAggs[key]);
    }
    return outData;

  },

  _processSet: function (set) {
    var dataSet = this._initDataSet()
    
    for (var i = 0; i < set.length; i++) { 
      this._processDataSet(dataSet, set[i]);
    }

    this._postProcessDataSet(dataSet);
    return this._generateSetData(dataSet);
  },

  _initDataSet: function () {
    var dataSet = [];
    for (var i = 0; i < this._fns.length; i++) { 
      var fn = this._fns[i];
      if (!fn.dataObject.data) throw new Error( 'total function must have a constant data');
      dataSet[i] = {
        value: fn.dataObject.data()
      };
    }
    return dataSet;
  },

  _processDataSet: function (dataSet, record) {
    for (var i = 0; i < this._fns.length; i++) { 
      var fn = this._fns[i];
      var value = record[fn.field];
      dataSet[i].value = fn.dataObject.process(value, dataSet[i].value);
    }
  },

  _postProcessDataSet: function (dataSet) {
    for (var i = 0; i < this._fns.length; i++) { 
      var fn = this._fns[i];
      if (fn.dataObject.postProcess) {
        dataSet[i].value = fn.dataObject.postProcess(dataSet[i].value);
      }
    }
  },

  _generateSetData: function (dataSet) {
    var obj = {};
    for (var i = 0; i < dataSet.length; i++) { 
      var data = dataSet[i];
      obj[this._fns[i].dataObject.key] = dataSet[i];
    }
    return obj;
  }

};

module.exports = Totals;
