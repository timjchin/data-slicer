module.exports = {
  key: 'uniqueValues',
  data: function () {
    return {};
  },
  process: function (d, data) {
    if (!data[d]) {
      data[d] = true;
    }
    return data;
  },
  postProcess: function (data) {
    return Object.keys(data);
  }
}
