var DataSlicer = require('../index');
var test = require('tape');
var _ = require('lodash');

test('process chunks', function (t) {
  t.plan(2);

  var dataChunkA = [{ 
    type: 'a',
    a: 1
  }, {
    type: 'b',
    a: 5
  }, { 
    type: 'a',
    a: 10
  }];

  var dataChunkB = _.cloneDeep(dataChunkA);
  var dataChunkC = _.cloneDeep(dataChunkA);

  var ds = DataSlicer();

  ds.totals()
    .uniqueBy('type')
    .total('a');
  
  ds.processChunk(dataChunkA);
  ds.processChunk(dataChunkB);
  ds.processChunk(dataChunkC);

  var agg = ds.chunksComplete();
  t.equal(agg.type.a.aggs.total, 33)
  t.equal(agg.type.b.aggs.total, 20);

});

