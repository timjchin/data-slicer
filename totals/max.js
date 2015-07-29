module.exports = {
  key: 'max',
  data: function () {
    return undefined;
  },
  process: function (d, data) {
    if (!data || d > data) {
      return d;
    } else {
      return data;
    }
  }
}
