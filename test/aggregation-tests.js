var DataSlicer = require('../index');
var test = require('tape');

test('top level aggregations', function (t) {
  t.plan(1);

  var data = [{ 
    a: 1
  }, {
    a: 5
  }, { 
    a: 10
  }];

  var ds = DataSlicer();
  ds.setData(data);

  var agg = ds.totals()
    .total('a')
    .process();

  t.equal(agg.aggs.total, 16, 'top level totals');
  
});


test('uniqueBy aggregations', function (t) {
  t.plan(2);

  var data = [{ 
    type: 'a',
    a: 1
  }, {
    type: 'b',
    a: 5
  }, { 
    type: 'a',
    a: 10
  }];

  var ds = DataSlicer();
  ds.setData(data);

  var agg = ds.totals()
    .uniqueBy('type')
    .total('a')
    .process();

  t.equal(agg.type.a.aggs.total, 11, 'uniqueBy totals');
  t.equal(agg.type.b.aggs.total, 5, 'uniqueBy totals');
  
});


test('multi level nested uniqueBy aggregations', function (t) {
  t.plan(4);

  var data = [{ 
    type: 'a',
    subType: 'z',
    a: 1
  }, {
    type: 'b',
    subType: 'y',
    a: 5
  }, { 
    type: 'a',
    subType: 'z',
    a: 10
  }];

  var ds = DataSlicer();
  ds.setData(data);

  var agg = ds.totals()
    .uniqueBy('type')
    .total('a')
    .uniqueBy('subType')
    .total('a')
    .process();

  // keep first level nested
  t.equal(agg.type.a.aggs.total, 11, 'first level nested uniqueBy totals');
  t.equal(agg.type.b.aggs.total, 5, 'first level nested uniqueBy totals');

  //nested level totals
  t.equal(agg.type.a.subType.z.aggs.total, 11, 'second level nested uniqueBy totals');
  t.equal(agg.type.b.subType.y.aggs.total, 5, 'second level nested uniqueBy totals');
  
});

test('uniqueValues', function (t) {
  t.plan(1);

  var data = [{ 
    a: 'a'
  }, {
    a: 'b'
  }, { 
    a: 'c'
  }];

  var ds = DataSlicer();
  ds.setData(data);

  var agg = ds.totals()
    .uniqueValues('a')
    .process();
  
  t.deepEqual(agg.aggs.uniqueValues, ['a', 'b', 'c'], 'unqiue values equal');
  
});


test('max / min value', function (t) {
  t.plan(2);

  var data = [{ 
    a: 100
  }, {
    a: 50 
  }, { 
    a: 10
  }];

  var ds = DataSlicer();
  ds.setData(data);

  var agg = ds.totals()
    .max('a')
    .min('a')
    .process();
  
  t.equal(agg.aggs.max, 100, 'max value');
  t.equal(agg.aggs.min, 10, 'min value');
  
});

