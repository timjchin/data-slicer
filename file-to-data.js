var fs = require('fs');
var csv = require('csv');
var d3 = require('d3');

function fileToData(path, cb) {
  if (path.match('csv')) {
    var stream = fs.createReadStream(path);
    var parser = csv.parse({ columns: true }, function (err, data) {
      if (err) throw new Error(err);
      cb(data);
    });
    stream.pipe(parser);
  } else if (path.match('json')) {
    fs.readFile(path, function (err, fileString) {
      if (err) throw new Error(err);
      return JSON.parse(fileString.toString());
    });
  }
}

module.exports = fileToData;
