var commander = require('commander');
var Aggregator = require('../index');
var benchmark = require('../benchmark/index');
var fs = require('fs');

commander
  .version('0.0.0')
  .option('-f, --file [name]', 'Main file to read aggregations from')
  .parse(process.argv);

if (!commander.file) throw new Error('File required (-f)');

benchmark.start('reading file');
var agg = Aggregator();
Aggregator.fileToData(commander.file, function (data) {
  benchmark.stop('reading file');

  agg.setData(data);

  var a = agg
    .transform('can_nam', 'lowercase')
    .transform('exp_amo', 'parseFloat')
    .transform('agg_amo', 'parseFloat')
    .modify()

  var totals = agg.totals()
    .uniqueBy('can_nam')
    .total('exp_amo')
    .sortBy('total')
    .uniqueBy('sup_opp')
    .uniqueBy('spe_nam')
    .uniqueBy('pur')
    .total('exp_amo')
    .sortBy('total')
    .min('exp_amo')
    .max('exp_amo')
    .mean('exp_amo')
    .process();

  benchmark.start('writing file');
  fs.writeFile('./test.json', JSON.stringify(totals, null, 2));
  benchmark.stop('writing file');

  benchmark.log();
});
