# Data Slicer
An in memory data transformer and aggregator to give summary counts for small to medium size datasets.

## API

Create an give your Slicer some Data

```js
var DataSlicer = require('data-slicer');

var ds = DataSlicer().setData([
  {
    type: 'firstType',
    a: '0',
    b: 1,
    c: '0.5'
  },
  {
    type: 'firstType',
    a: 0,
    b: 8,
    c: '0.25'
  },
  {
    type: 'secondType',
    a: 0,
    b: 9,
    c: '0.0'
  }
]);
```

DataSlicer does not know much about the data that you pass through it, other than the fieldnames that you give it at each stage. 


## Transforms

#### Methods: 
 - transform
 - modify


Getting good information out of your data normally takes a few stages, first you need to clean the data. To assist with this, DataSlicer has two methods, `transform` and `modify`.
Continuing with our example above, we can see that the first case of a is a String, when really want integers.


```js
ds.transform('a', 'parseInt')
  .transform('c', 'parseFloat')
  .modify();
```

```js
ds.transform(fieldName, function || string)
```

Possible Default Options:

```
lowercase - lowercases string values
parseFloat
parseInt
```

**All transforms will not be applied until you call `.modify()`**


### Custom Transforms
If you do not use one of the preset transform functions, you can supply custom functions. 

These functions are passed two arguments, record and field. You are expected to reassign the field to the record if it's appropriate to change the record.

example of turning 0's into 'zilch's:

```js
ds.transform('a', function(record, field) { 
  if (record[field] === 0) {
    record[field] = 'zilch';
  }
});
```

## Totals
Totals allow you to get general information about the combination of a set of records.

#### Methods: 
  - uniqueBy(field)
  - sortBy(totalType)
  - total(field)
  - min(field)
  - max(field)
  - count(field)
  - mean(field)
  - customTotals(field, definition)

input:

```js
ds.totals()
  .uniqueBy('type')
  .total('a')
```

output:

```js
{
  "type": {
    "firstType": {
      "aggs": {
        "total": 0
      },
      "type": {
        "firstType": {
          "aggs": {
            "total": 0
          },
          "secondaryType": {
            "food": {
              "aggs": {
                "total": 0,
                "average": 0,
                "min": 0,
                "max": 0
              }
            },
            "beverage": {
              "aggs": {
                "total": 0,
                "average": 0,
                "min": 0,
                "max": 0
              }
            }
          }
        }
      }
    },
    "secondType": {
      "aggs": {
        "total": 10
      },
      "type": {
        "secondType": {
          "aggs": {
            "total": 10
          },
          "secondaryType": {
            "food": {
              "aggs": {
                "total": 10,
                "average": 10,
                "min": 10,
                "max": 10
              }
            }
          }
        }
      }
    }
  }
}
```

## UniqueBy
This chooses a specific field to gather additional nested data on. UniqueBy's can be nested as many times as desired.

input:

```js
ds.totals()
  .uniqueBy('type')
  .total('a')
  .uniqueBy('secondaryType')
  .total('a')
  .mean('a')
  .min('a')
  .max('a')
  .process();
```

output:

```js
{
  "type": {
    "firstType": {
      "aggs": {
        "total": 0
      }
    },
    "secondType": {
      "aggs": {
        "total": 0
      }
    }
  }
}
```


## SortBy

## Custom totals / Totals Definitions

