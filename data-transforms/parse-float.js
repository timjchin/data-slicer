module.exports = function (record, field) {
  if (record[field]) {
    // allow for '$10,000.50'
    record[field] = record[field].replace(/[^\d|^\.]+/g, '');
    record[field] = parseFloat(record[field]);
  }
}
