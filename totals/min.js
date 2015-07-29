module.exports = {
  key: 'min',
  data: function () {
    return undefined;
  },
  process: function (d, minData) {
    if (!minData || d < minData) {
      return d;
    } else {
      return minData;
    }
  }
}
