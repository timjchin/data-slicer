module.exports = {
  key: 'count',
  data: function () {
    return 0;
  },
  process: function (d, data) {
    return data++;
  }
}
