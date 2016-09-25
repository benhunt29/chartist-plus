var Chartist = require('chartist');
// this is a necessary hack to allow plugins to be tacked on to the Chartist object
global.Chartist = Chartist;
require('chartist-plugin-axistitle');
require('chartist-plugin-tooltips');
require('chartist-plugin-zoom');
var ChartistPlus = {
    BarChart: function (selector, data, options = {}, responsiveOptions, pluginOptions) {

        options.chartPadding = options.chartPadding ||
            {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15
            };

        options.classNames.bar = 'ct-bar-wide';

        options.plugins = options.plugins || [];
        var existingPlugins = options.plugins.map(function(plugin){
            return plugin.name;
        });
        if (existingPlugins.indexOf('ctAxisTitle') < 0) {
            options.plugins.push(Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: data.xAxisLabel || '',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 40
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: data.yAxisLabel || '',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 10
                    },
                    textAnchor: 'middle',
                    flipTitle: true
                }
            }));
        }

        return new Chartist.Bar(selector, data, options)
    }
};

module.exports = ChartistPlus;
