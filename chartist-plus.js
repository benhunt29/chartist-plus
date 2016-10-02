var Chartist = require('chartist');
// this is a necessary hack to allow plugins to be tacked on to the Chartist object
global.Chartist = Chartist;
require('chartist-plugin-axistitle');
require('chartist-plugin-tooltips');
require('chartist-plugin-zoom');

function labelInput(chart, labelClass) {
    var input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.className = labelClass + ' ct-label-edit ct-label ct-horizontal';
    function enterHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.which === 13 && this.value) {
            e.target.removeEventListener(e.type, enterHandler);
            e.target.removeEventListener('blur', blurHandler);
            updateAxis(this);
        }
    }

    function blurHandler(e) {
        this.removeEventListener(e.type, blurHandler);
        e.stopPropagation();
        e.preventDefault();
        if (this.value) {
            updateAxis(this);
        }
    }

    function updateAxis(input) {
        switch (input.classList[0]) {
            case 'x-start':
                chart.options.axisX.low = input.value;
                break;
            case 'x-end':
                chart.options.axisX.high = input.value;
                break;
            case 'y-start':
                chart.options.axisY.low = input.value;
                break;
            case 'y-end':
                chart.options.axisY.high = input.value;
                break;
        }
        chart.update(chart.data, chart.options);
        console.log(chart.options);
    }
    input.addEventListener('keyup', enterHandler);
    input.addEventListener('blur', blurHandler);
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

        options.showLine = false;
        options.axisX = {
            type: Chartist.AutoScaleAxis,
            onlyInteger: false
        }

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
                    console.log(context.axis.units.dir);
                    context.element._node.classList.add('editable-label');
                    context.element._node.addEventListener('click', function(e) {
                        var labelClass = context.axis.units.dir === 'vertical' ? 'y' : 'x';
                        labelClass += context.index === 0 ? '-start' : '-end';
                        var blurrableElements = histogram.svg._node.querySelectorAll('.ct-grids, .ct-series');
                        for (let element of blurrableElements) {
                            element.setAttribute('filter', 'url("#blur")');
                        }
                        this.setAttribute('y', context.axis.chartRect.y1/2);
                        this.setAttribute('x', context.axis.chartRect.x2/2);
                        this.removeChild(this.children[0]);
                        this.appendChild(labelInput(histogram, labelClass));
                        this.removeEventListener(e.type, arguments.callee);
                    }, false);
                }
            }
            if (context.type === 'point') {
                var rectangle = new Chartist.Svg('rect', {
                    x: context.x + context.axisX.chartRect.padding.right,
                    y: context.y,
                    width: 5,
                    height: Math.max(context.axisY.chartRect.y1  - context.y, 0)
                }, 'ct-bar ct-bar-histogram');
                context.element.replace(rectangle);
            }
        }).on('created', function(context){
            var defs = context.svg.elem('defs');
            defs.elem('filter', {
                id: 'blur'
            }).elem('feGaussianBlur', {
                in: 'SourceGraphic',
                stdDeviation: '2'
            });
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
