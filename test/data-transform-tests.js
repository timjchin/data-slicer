var DataSlicer = require('../index');
var test = require('tape');


test('parseInt', function (t) {
  t.plan(2);

  var data = [{
    a: '$15,000'
  }, {
    a: 'a15,000'
  }];
  var ds = DataSlicer();
  ds.setData(data)

  ds.transform('a', 'parseInt')
    .modify();

  t.equal(ds.data[0].a, 15000, 'data transform parseInt equals')
  t.equal(ds.data[1].a, 15000, 'data transform parseInt equals')  
  
});

test('lowercase', function (t) {
  t.plan(1);

  var data = [{
    a: 'SCREAMING UPPERCASE'
  }];
  var ds = DataSlicer();
  ds.setData(data)

  ds.transform('a', 'lowercase')
    .modify();

  t.equal(ds.data[0].a, 'screaming uppercase', 'lowercase equals')
});


test('parseFloat', function (t) {
  t.plan(2);

  var data = [{
    a: '$15,000.50'
  }, {
    a: 'a15,000.50'
  }];
  var ds = DataSlicer();
  ds.setData(data)

  ds.transform('a', 'parseFloat')
    .modify();

  t.equal(ds.data[0].a, 15000.5, 'parseFloat equals')
  t.equal(ds.data[1].a, 15000.5, 'parseFloat equals')  
});

