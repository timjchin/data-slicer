var commander = require('commander');
var fileToData = require('./file-to-data');
var Aggregator = require('./aggregator');
var fs = require('fs');

commander
  .version('0.0.0')
  .option('-f, --file [name]', 'Main file to read aggregations from')
  .parse(process.argv);


if (!commander.file) throw new Error('File required (-f)');

var agg = new Aggregator();
fileToData(commander.file, function (data) {

  agg.setData(data);

  var a = agg
    .transform('can_nam', 'lowercase')
    .transform('exp_amo', 'parseFloat')
    .transform('agg_amo', 'parseFloat')
    .modify()

  var totals = agg.totals()
    .uniqueBy('can_nam')
    .uniqueBy('sup_opp')
    .uniqueBy('spe_nam')
    .uniqueBy('pur')
    .total('exp_amo')
    .min('exp_amo')
    .max('exp_amo')
    .mean('exp_amo')
    .process();

  fs.writeFile('./test.json', JSON.stringify(totals, null, 2));


});

