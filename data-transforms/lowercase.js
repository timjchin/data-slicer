module.exports = function (record, field) {
  if (typeof record[field] === 'string') {
    record[field] = record[field].toLowerCase();
  }
}
