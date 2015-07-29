var lowercaseTransform = require('./lowercase');
var parseIntTransform = require('./parse-int');
var parseFloatTransform = require('./parse-float');

/**
  */
function DataTransformer (transformOpts) {
  this.transformOpts = [];
  this.name= 'dt';
}

var transforms = {
  lowercase: lowercaseTransform,
  parseInt: parseIntTransform,
  parseFloat: parseFloatTransform
}

DataTransformer.prototype = { 
  _setData: function (data) {
    this.data = data;
  },
  transform: function (field, value) {
    if (typeof value === 'string') {
      if (transforms[value]) {
        value = transforms[value];
      }
    }
    if (typeof value !== 'function') {
      throw new Error('transform ' + value + ' is not a function');
    }
    this.transformOpts.push({
      field: field, 
      fn: value
    });
    return this;
  },

  modify: function () {
    if (this.transformOpts.length == 0) {
      return cb(data);
    }

    for (var i = 0; i < this.data.length; i++) { 
      this.transformRecord(this.data[i]);
    }

    return this.data;
  },

  transformRecord: function (d) {
    for (var i = 0; i < this.transformOpts.length; i++) { 
      var opt = this.transformOpts[i];
      opt.fn(d, opt.field);
    }
  }

};


module.exports = DataTransformer;
