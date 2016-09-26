var Chartist = require('chartist');
// this is a necessary hack to allow plugins to be tacked on to the Chartist object
global.Chartist = Chartist;
require('chartist-plugin-axistitle');
require('chartist-plugin-tooltips');
require('chartist-plugin-zoom');

function labelInput(chart) {
    var input = document.createElement('input');
    input.className = 'ct-label-edit ct-label ct-horizontal';
    input.addEventListener('keyup', function(e) {
        if (e.which === 13) {
            this.removeEventListener(e.type, arguments.callee);
            chart.options.high = 15;
            console.log(chart.data);
            chart.update(chart.data, chart.options);
        }
        e.stopPropagation();
        e.preventDefault();
    });
    input.addEventListener('blur', function(e) {
        this.removeEventListener(e.type, arguments.callee);
        e.stopPropagation();
        e.preventDefault();
    });
    return input;
}

var ChartistPlus = {
    Histogram: function (selector, data, options = {}, responsiveOptions, pluginOptions) {
        options.chartPadding = options.chartPadding ||
            {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15
            };

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
            // options.plugins.push(Chartist.plugins.zoom({
            //     onZoom: function (chart, reset) {
            //         console.log(StoreReset);
            //         storeReset(reset);
            //     }
            // }))
        }

        var histogram =  new Chartist.Line(selector, data, options).on('draw', function(context){
            if (context.type === 'label') {
                if (context.index === 0 || context.index === context.axis.ticks.length - 1) {
                    context.element._node.addEventListener('click', function(e) {
                        this.removeChild(this.children[0]);
                        this.appendChild(labelInput(histogram));
                        this.removeEventListener(e.type, arguments.callee);
                    }, false);
                }
            }
            if (context.type === 'point') {
                var rectangle = new Chartist.Svg('rect', {
                    x: context.x + context.axisX.chartRect.padding.right,
                    y: context.y,
                    width: 5,
                    height: context.axisY.chartRect.y1 - context.axisY.chartRect.padding.bottom - context.y
                }, 'ct-bar');
                context.element.replace(rectangle);
            }
        });
        return histogram;
    },
    HistogramFit: function (selector, data, options = {}, responsiveOptions, pluginOptions) {

        options.chartPadding = options.chartPadding ||
            {
                top: 15,
                right: 15,
                bottom: 15,
                left: 15
            };

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
            options.plugins.push(Chartist.plugins.zoom({
                onZoom: function (chart, reset) {
                    console.log(StoreReset);
                    storeReset(reset);
                }
            }))
        }

        var barChartDiv = document.createElement('div');
        barChartDiv.className = 'histogram-bar';
        var lineChartDiv = document.createElement('div');
        lineChartDiv.className = 'histogram-line';
        var chartContainer = document.getElementById(selector.replace('#', ''));
        chartContainer.appendChild(barChartDiv);
        chartContainer.appendChild(lineChartDiv);

        var lineChart =  new Chartist.Line(chartContainer.children[0], data, options).on('draw', function(context){
            if (context.type === 'label') {
                if (context.index === 0 || context.index === context.axis.ticks.length - 1) {
                    context.element._node.addEventListener('click', function(e) {
                        // console.log(this.children[0]);
                        console.log('CLICK');
                        console.log(e.target);
                        this.removeChild(this.children[0]);
                        this.appendChild(labelInput(lineChart));
                        this.removeEventListener(e.type, arguments.callee);
                    });
                }
            }
            if (context.type === 'point') {
                console.log(context);
                var rectangle = new Chartist.Svg('rect', {
                    x: context.x,
                    y: context.y,
                    width: 10,
                    height: 10
                }, 'ct-bar');
                context.element.replace(rectangle);
            }
        });

        // var barChart =  new Chartist.Bar(chartContainer.children[1], data, options).on('draw', function(context){
        //     if (context.type === 'label') {
        //         if (context.index === 0 || context.index === context.axis.ticks.length - 1) {
        //             context.element._node.addEventListener('click', function(e) {
        //                 // console.log(this.children[0]);
        //                 console.log('CLICK');
        //                 console.log(e.target);
        //                 this.removeChild(this.children[0]);
        //                 this.appendChild(labelInput(barChart));
        //                 this.removeEventListener(e.type, arguments.callee);
        //             });
        //         }
        //     }
        // });
        return lineChart;
    },

};

module.exports = ChartistPlus;
