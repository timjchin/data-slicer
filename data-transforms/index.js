var lowercaseTransform = require('./lowercase');
var parseIntTransform = require('./parse-int');
var parseFloatTransform = require('./parse-float');

/**
  * Modifies or filters a set of data. 
  * @class DataTransformer
  */
function DataTransformer () {
  this.transformOpts = [];
}

DataTransformer.Transforms = {
  lowercase: lowercaseTransform,
  parseInt: parseIntTransform,
  parseFloat: parseFloatTransform
}

DataTransformer.TYPES = { 
  transform: 0,
  filter: 1,
};

DataTransformer.prototype = { 
  /**
   *  Pass a function that is called in the same chain of transforms as the transform functions, 
   *  allowing you to filter on transformed data. The boolFunction should return true to keep the element, 
   *  false otherwise.
   *
   *  @method filter
   *  @param boolFunction {function} - function to determine if a record should be removed or not
   */
  filter: function (boolFunction) {
    this.transformOpts.push({ 
      type: DataTransformer.TYPES.filter,
      fn: boolFunction
    });
    return this;
  },
  /**
   *  @method transform
   *  @param field {string} key to transform
   *  @param value {string || function} string: preset transform matching a key in DataTransformer.Transforms.
   *    function: a custom tarnsform function, which is passed two arguments, record, and field.
   *    Transform functions are expected to overwrite the field values on the record.
   */
  transform: function (field, value) {
    if (typeof value === 'string') {
      if (DataTransformer.Transforms[value]) {
        value = DataTransformer.Transforms[value];
        if (!value) { 
          throw new Error(value + ' is not a valid transform. Valid transforms are ' + 
            (Object.keys(DataTransformer.Transforms).join(' ')) + '.');
        }
      }
    }
    if (typeof value !== 'function') {
      throw new Error('transform ' + value + ' is not a function');
    }
    this.transformOpts.push({
      field: field, 
      fn: value,
      type: DataTransformer.TYPES.transform,
    });
    return this;
  },

  /**
   *  Apply the filters and transforms to the data set.
   *  @method modify
   *  @public
   */
  modify: function () {
    if (this.transformOpts.length == 0) {
      return cb(data);
    }

    for (var i = 0; i < this.data.length; i++) { 
      var d = this.data[i];

      for (var j = 0; j < this.transformOpts.length; j++) { 
        var opt = this.transformOpts[j];

        if (opt.type == DataTransformer.TYPES.filter) {
          if (!opt.fn(d)) { 
            this.data.splice(i, 1);
            break;
          }
        } else if (d[opt.field]) { 
          opt.fn(d, opt.field);
        }

      }
    }

    return this.data;
  },

  /**
   *  @method _setData
   *  @private
   */
  _setData: function (data) {
    this.data = data;
  },

};


module.exports = DataTransformer;
