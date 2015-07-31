var benchMarks = {};

function validate (key) {
  if (!benchMarks[key]) { 
    benchMarks[key] = {
      start: undefined,
      stop: undefined
    };
  }
}

function start (key, stop) {
  validate(key);
  benchMarks[key].start = Date.now();
}

function stop(key, stop) {
  validate(key);
  benchMarks[key].stop = Date.now();
}

function log () {
  var total = 0;
  for (var key in benchMarks) { 
    var data = benchMarks[key];
    var value = data.stop - data.start;
    total += value;
    console.log(key + ': ' + value + 'ms');
  }
  console.log('total: ' + total + 'ms');
}

module.exports = {
  start: start,
  stop: stop,
  log: log
}
