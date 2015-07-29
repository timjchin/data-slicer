module.exports = {
  key: 'average',
  data: function () {
    return {
      length: 0,
      value: 0
    };
  },
  process: function (d, data) {
    data.value += d;
    data.length++;
    return data;
  },
  postProcess: function (data) {
    return data.value / data.length;
  }
}
