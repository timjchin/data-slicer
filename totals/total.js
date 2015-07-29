var numberWithCommas = require('../utils/number-with-commas');
module.exports = {
  key: 'total',
  data: function () {
    return 0;
  },
  process: function (d, data) {
    data += d;
    return data;
  },
  postProcess: function (data) {
    return {
      value: data,
      prettyPrint: numberWithCommas(data)
    }
  }
}
