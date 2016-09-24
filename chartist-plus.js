const Chartist = require('chartist');
// this is a necessary hack to allow plugins to be tacked on to the Chartist object
global.Chartist = Chartist;
require('chartist-plugin-axistitle');
require('chartist-plugin-tooltip');
require('chartist-plugin-zoom');
var ChartistPlus = {
    BarChart: function (selector, data, options = {}, responsiveOptions, pluginOptions) {
        options.plugins = options.plugins || [];
            options.plugins.push(chartistAxisTitle({
                axisX: {
                    axisTitle: data.xAxisLabel || '',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 30
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: data.yAxisLabel || '',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: -5
                    },
                    textAnchor: 'middle',
                    flipTitle: false
                }
            }));

        return new Chartist.Bar(selector, data, options)
    }
};

module.exports = ChartistPlus;
