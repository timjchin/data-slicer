var DataSlicer = require('../index');
var test = require('tape');

test('sort by agg', function (t) {

  t.plan(2);
  var data = [{
    a: 2,
    type: 'c'
  }, {
    a: 0,
    type: 'a'
  }, {
    a: 1,
    type: 'b'
  }];

  var ds = DataSlicer();
  ds.setData(data)

  var agg = ds.totals()
    .uniqueBy('type')
    .total('a')
    .sortBy('total')
    .process()

  t.deepEqual(keyMap(agg), [0,1,2], 'ascending key sort');

  var agg = ds.totals()
    .uniqueBy('type')
    .total('a')
    .sortBy('total', {descending: true})
    .process()

  t.deepEqual(keyMap(agg), [2,1,0], 'descending key sort');


  function keyMap(agg) {
    return agg.type.map(function (type) {
      return type.aggs.total;
    })
  }

});


test('sort by key', function (t) {

  t.plan(2);
  var data = [{
    a: 2,
    type: 'c'
  }, {
    a: 0,
    type: 'a'
  }, {
    a: 1,
    type: 'b'
  }];

  var ds = DataSlicer();
  ds.setData(data)

  var agg = ds.totals()
    .uniqueBy('a')
    .sortByKey()
    .process()

  t.deepEqual(keyMap(agg), ['0','1','2'], 'ascending key sort');

  var agg = ds.totals()
    .uniqueBy('a')
    .sortByKey({descending: true})
    .process()

  t.deepEqual(keyMap(agg), ['2','1','0'], 'ascending key sort');

  function keyMap(agg) {
    return agg.a.map(function (type) {
      return type.key;
    });
  }

});

