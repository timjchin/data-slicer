module.exports = {
  key: 'total',
  data: function () {
    return 0;
  },
  process: function (d, data) {
    data += d;
    return data;
  },
}
