# chartist-plus 
A wrapper to set some defaults for charts, add plugins, and other functionality. This plugin adds two new chart types, Histogram (with x and y data instead of solely y data) and Scatter. Both types operate in the same manner with the difference being only in the visual presentation (histogram plots as bars, scatter as points).

## Plugins Enabled by Default
* [Zoom](https://github.com/hansmaad/chartist-plugin-zoom)
* [Tooltip](https://github.com/benhunt29/chartist-plugin-tooltip) (forked version to extend plugin to touch events)
* [Axis title](https://github.com/alexstanbury/chartist-plugin-axistitle)

## Features
* Double-tap the chart area to reset axes to default
* The first and last axis value of each axis may be adjusted as a zoom alternative. To use this feature, simply click the min/max value of the axis to adjust and enter a new value.

## Sample Usage
```
var ChartistPlus = require('chartist-plus');

var data1 =  [
        {x: 1500, y: 2}, {x: 1600, y: 3}, {x: 1700, y: 2}, {x: 1800, y: 7}, {x: 1900, y: 14}, {x: 2000, y: 17.5}, {x: 2100, y: 25}, {x: 2200, y: 19}, {x: 2300, y: 16}, {x: 2400, y: 9}
];

var data2 =  [
    {x: 1500, y: 4}, {x: 1600, y: 1}, {x: 1700, y: 3}, {x: 1800, y: 9}, {x: 1900, y: 17}, {x: 2000, y: 16.1}, {x: 2100, y: 25.9}, {x: 2200, y: 24}, {x: 2300, y: 12}, {x: 2400, y: 9.5}
];

var chart1 = ChartistPlus.Histogram(
    '#chart1',
    {
        series: [
            data1,
            data2
        ],
        yAxisLabel: 'Counts [#/cc]',
        xAxisLabel: 'Voltage [V]'
    });
var chart2 = ChartistPlus.Scatter(
    '#chart2',
    {
        series: [
            data1,
            data2
        ],
        yAxisLabel: 'Counts [#/cc]',
        xAxisLabel: 'Voltage [V]'
    });
```
