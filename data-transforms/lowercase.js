module.exports = function (record, field) {
  if (record[field] && record[field].toLowerCase) {
    record[field] = record[field].toLowerCase();
  }
}
