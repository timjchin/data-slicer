module.exports = function (record, field) {
  if (record[field]) {
    record[field] = record[field].toLowerCase();
  }
}
