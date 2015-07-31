module.exports = function (record, field) {
  if (record[field] && typeof record[field] == 'string') {
    // allow for '$10,000.50'
    record[field] = record[field].replace(/[^\d|^\.]+/g, '');
    record[field] = parseInt(record[field]);
  }
}
