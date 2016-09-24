const Chartist = require('./bower_components/chartist/dist/chartist.min.js');
const chartistPluginAxisTitle = require('./bower_components/chartist-plugin-axistitle/dist/chartist-plugin-axistitle.min.js');
const chartistPluginTooltip = require('./bower_components/chartist-plugin-tooltip/dist/chartist-plugin-tooltip.min.js');
const chartistPluginZoom = require('./bower_components/chartist-plugin-zoom/dist/chartist-plugin-zoom.min.js');

var ChartistPlus = {
    BarChart: function (selector, data, options = {}, responsiveOptions, pluginOptions) {
        options.plugins = options.plugins || [];
            options.plugins.push(Chartist.plugins.ctAxisTitle({
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
