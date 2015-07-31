var DataSlicer = require('../index');

var ds = DataSlicer().setData([
  {
    type: 'firstType',
    secondaryType: 'food',
    a: '0',
    b: 1,
    c: '0.5'
  },
  {
    type: 'firstType',
    secondaryType: 'beverage',
    a: 0,
    b: 8,
    c: '0.25'
  },
  {
    type: 'secondType',
    secondaryType: 'food',
    a: 10,
    b: 9,
    c: '0.0'
  }
]);

ds.transform('a', 'parseInt')
  .transform('c', 'parseFloat')
  .modify();


var firstOutput = ds.totals()
  .uniqueBy('type')
  .total('a')
  .process();

console.log(JSON.stringify(firstOutput, null, 2));

console.log('------------');

var nestedOutput = 
  ds.totals()
    .uniqueBy('type')
    .total('a')
    .uniqueBy('secondaryType')
    .total('a')
    .mean('a')
    .min('a')
    .max('a')
    .process();

console.log(JSON.stringify(nestedOutput, null, 2));

console.log('------------');


var sortedOutput = 
  ds.totals()
    .uniqueBy('type')
    .total('a')
    .sortBy('total')
    .process();

console.log(JSON.stringify(sortedOutput, null, 2));

