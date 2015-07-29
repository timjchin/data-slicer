/**   
 *
 * Internal Data aggregation nested data structure
 * dataAggregation = {
 *     aggregations: [
 *       {
 *         dataObject: function () {},
 *         field: 'fieldname'
 *       }
 *     ],
 *     field: undefined || field to nest by
 *     nested: undefined || dataAggregation
 *   };
 */
function Totals(opts) {
  this._outDataFormat = Totals.buildAggregationLevel();

  this._currentNestedLevel = this._outDataFormat;

  for (var key in Totals.functions) { 
    this[key] = function (key, field) {
      this._currentNestedLevel.aggregations.push({
        dataObject: Totals.functions[key],
        field: field
      });
      return this;
    }.bind(this, key);
  }
}

Totals.buildAggregationLevel = function (field) {
  return {
    aggregations: [],
    nested: undefined,
    field: field
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
  /**
   *  @method _setData
   *  @private
   *  @param data {array|Objects} - data, set by aggregator
   */
  _setData: function (data) {
    this.data = data;
  },

  /**
   *  For each key that you call uniqueBy on, aggregations at a specific
   *  layer will be added together, allowing you to get unique counts for a
   *  specific nested combination of values. Can be nested as many times as desired.
   *
   *  @method uniqueBy
   *  @public
   *  @param field {string} data key to nest on
   */
  uniqueBy: function (field) {
    this._currentNestedLevel.nested = Totals.buildAggregationLevel(field);
    this._currentNestedLevel = this._currentNestedLevel.nested;
    return this;
  },

  /**
   *  Data is looped through once, and for each record, we loop through the
   *  dataAggregation structure. Based on the state of the data going out, we can
   *  initialize a dataset, and then process each dataset.
   *
   *  The aggregations are stored in arrays for ease of looping, and then cleaned up 
   *  in the postProcessing loop.
   *
   *  @method process
   */
  process: function () {
    var outData = {};
    var toPostProcess = [];

    for (var i = 0; i < this.data.length; i++) {

      var record = this.data[i];

      var currentNested = this._outDataFormat;
      var currentOutData = outData;

      while (currentNested) {
        if (currentNested.field) {
          var field = currentNested.field;
          var recordFieldValue = record[field];

          if (!currentOutData[field]) {
            currentOutData[field] = {};
          }

          if (!currentOutData[field][recordFieldValue]) { 
            currentOutData[field][recordFieldValue] = {};
            if (currentNested.aggregations.length) {
              currentOutData[field][recordFieldValue] = this._initDataSet(currentNested.aggregations);
              toPostProcess.push({
                parentDataSet: currentOutData[field],
                fieldValue: recordFieldValue,
                aggs: currentNested.aggregations
              });
            }
          }

          if (currentNested.aggregations.length) {
            var currDataSet = currentOutData[field][recordFieldValue];
            this._processDataSet(currentNested.aggregations, currDataSet, record);
          }

          currentOutData = currentOutData[field][recordFieldValue];

        }
        currentNested = currentNested.nested;
      }
    }

    for (var i = 0; i < toPostProcess.length; i++) { 
      var postProcess = toPostProcess[i];
      var currentOutDataLayer = postProcess.parentDataSet[postProcess.fieldValue];
      this._postProcessDataSet(postProcess.aggs, currentOutDataLayer);
      postProcess.parentDataSet[postProcess.fieldValue] = this._generateSetData(currentOutDataLayer, postProcess.aggs);
    }

    return outData;
  },

  /**
   *  Note that each dataSet keeps it's values stored in an object with one key of value.
   *  This allows the total definiton objects to return numerical and string values.
   *
   *  @method _initDataSet
   *  @private
   *  @param aggs {Array} 
   */
  _initDataSet: function (aggs) {
    var dataSet = [];
    for (var i = 0; i < aggs.length; i++) { 
      var fn = aggs[i];
      if (!fn.dataObject.data) throw new Error( 'total function must have a constant data');
      dataSet[i] = {
        value: fn.dataObject.data()
      };
    }
    return dataSet;
  },

  _processDataSet: function (aggs, dataSet, record) {
    for (var i = 0; i < aggs.length; i++) { 
      var fn = aggs[i];
      var value = record[fn.field];
      dataSet[i].value = fn.dataObject.process(value, dataSet[i].value);
    }
  },

  _postProcessDataSet: function (aggs, dataSet) {
    for (var i = 0; i < aggs.length; i++) { 
      var fn = aggs[i];
      if (fn.dataObject.postProcess) {
        dataSet[i].value = fn.dataObject.postProcess(dataSet[i].value);
      }
    }
  },

  _generateSetData: function (dataSet, aggs) {
    var obj = {};
    for (var i = 0; i < dataSet.length; i++) { 
      var data = dataSet[i];
      obj[aggs[i].dataObject.key] = dataSet[i].value;
    }
    return obj;
  }

};

module.exports = Totals;
