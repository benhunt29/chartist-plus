(function (root, factory) {
    module.exports = factory();
}(this, function () {
    const Chartist = require('chartist');
    this.Chartist = Chartist; // The leaks the `Chartist` global so that plugins (which require/expect it) work
    const ctAxisTitle = require('chartist-plugin-axistitle');
    const ctToolTips = require('chartist-plugin-tooltips');
    const ctZoom = require('chartist-plugin-zoom');

    function labelInput(chart, labelClass, value) {
        var input = document.createElement('input');
        input.setAttribute('type', 'tel');
        input.className = labelClass + ' ct-label-edit ct-label ct-horizontal';
        input.value = value;

        // chart.svg._node.querySelector('.chart-area').style.display = 'none';
        function clearZoom(){
            chart.options.axisX.highLow = null;
            chart.options.axisY.highLow = null;
        }

        function enterHandler(e) {
            // e.preventDefault();
            // e.stopPropagation();
            if (e.which === 13 && this.value) {
                e.target.removeEventListener(e.type, enterHandler);
                e.target.removeEventListener('blur', blurHandler);
                updateAxis(this);
            }
        }

        function blurHandler(e) {
            e.stopPropagation();
            e.preventDefault();
            this.removeEventListener(e.type, blurHandler);
            e.target.removeEventListener('keyup', enterHandler);
            updateAxis(this);
        }

        function updateAxis(input) {
            if (input.value) {
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
                // override zoom plugin if currently enabled
                clearZoom();
            }
            chart.update(chart.data, chart.options);
        }
        input.addEventListener('keyup', enterHandler);
        input.addEventListener('blur', blurHandler);
        return input;
    }

    const reset = (chart, options) => {
        chart.update(chart.data, options);
    };

    const getHistogramTicks = (labels) => {
        return labels.map(function(label){
            return label.split('-')[0].replace(/[^0-9]/,'');
        })
    }

    function getDefaultOptions(options, data, type) {
        this.chartPadding = options.chartPadding ||
            {
                top: 15,
                right: 20,
                bottom: 15,
                left: 20
            };
        var xhighLow = Chartist.getHighLow(data.series, options, 'x')
        this.showLine = false;
        if (type === 'histogram') {
            let ticks = getHistogramTicks(data.labels);
            this.axisX = {
                type: Chartist.FixedScaleAxis,
                onlyInteger: false,
                high: 1.02*ticks[ticks.length - 1],
                low: 0.98*ticks[0],
                ticks: ticks
            };
        } else {
            this.axisX = {
                type: Chartist.AutoScaleAxis,
                onlyInteger: false,
                scaleMinSpace: 50,
                high: 1.02*xhighLow.high,
                low: 0.98*xhighLow.low
            };
        }
        this.plugins = options.plugins || [];
        var existingPlugins = this.plugins.map(function(plugin){
            return plugin.name;
        });
        if (existingPlugins.indexOf('ctAxisTitle') < 0) {
            this.plugins.push(Chartist.plugins.ctAxisTitle({
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
                        y: 15
                    },
                    textAnchor: 'middle',
                    flipTitle: true
                }
            }));
            this.plugins.push(Chartist.plugins.zoom());
            this.plugins.push(Chartist.plugins.tooltip( {
                pointClass: 'ct-tooltip',
                anchorToPoint: true,
                tooltipOffset: {
                    y: 0,
                    x: 0
                }
            }));
        }
    }

    function customChartDraw(context, chart, type) {
        type = type || 'scatter';
        function labelEditHandler(e){
            var chartSvg = context.group._node.parentNode;
            var labelClass = context.axis.units.dir === 'vertical' ? 'y' : 'x';
            labelClass += context.index === 0 ? '-start' : '-end';
            var blurrableElements = chartSvg.querySelectorAll('.ct-grids, .ct-series');
            for (let element of blurrableElements) {
                element.setAttribute('filter', 'url("#blur")');
            }
            this.setAttribute('y', context.axis.chartRect.y1/2);
            this.setAttribute('x', context.axis.chartRect.x2/2);
            this.appendChild(labelInput(chart, labelClass, this.children[0].innerHTML));
            this.removeChild(this.children[0]);
            chartSvg.appendChild(this);
            this.children[0].focus();
            this.removeEventListener(e.type, labelEditHandler);
            // for some reason on mobile a resize event gets triggered, need to override this
            window.removeEventListener('resize', chartSvg.resizeListener);
            // this.removeEventListener('touchstart', labelEditHandler);
        }

        if (context.type === 'label') {
            if (context.index === 0 || context.index === context.axis.ticks.length - 1) {
                var element = context.element._node;
                element.classList.add('editable-label');
                // element.addEventListener('touchstart', labelEditHandler);
                element.addEventListener('click', labelEditHandler);
            }
            if (type === 'histogram') {
                context.text = chart.data.labels[context.index];
            }
        }
        if (context.type === 'point') {
            // prevent drawing bars off the chart
            if (type === 'histogram') {
                var rectangle = new Chartist.Svg('rect', {
                    x: Math.max(context.x, context.x - context.axisX.chartRect.padding.right),
                    y: Math.max(context.y, context.axisY.chartRect.padding.top),
                    // this is set via css
                    width: 1,
                    height: Math.max(0, Math.min(context.axisY.chartRect.y1 - context.y, context.axisY.chartRect.y1 - context.axisY.chartRect.padding.top)),
                    'clip-path': 'url(#zoom-mask)',
                    'ct:value': context.value.x + ',' + context.value.y,
                    'ct:meta': context.meta,
                    class: 'ct-tooltip'
                }, 'ct-bar ct-bar-histogram');
                context.element.replace(rectangle);
            } else {
                context.element.addClass('ct-tooltip');
            }
        }
    }

    function customChartCreated(context, chart, chartType) {
        // double click to reset zoom
        context.svg._node.addEventListener('dblclick', function(){
            reset(chart, new getDefaultOptions(chart.options, chart.data, chartType));
        });
        var defs = context.svg.elem('defs');
        defs.elem('filter', {
            id: 'blur'
        }).elem('feGaussianBlur', {
            in: 'SourceGraphic',
            stdDeviation: '2'
        });
        defs.elem('zoom-rect', {
            id: 'zoom-rect'
        }).elem('feGaussianBlur', {
            in: 'SourceGraphic',
            stdDeviation: '2'
        });
    }

    const ChartistPlus = {
        Histogram(selector, data, options, responsiveOptions, pluginOptions) {
            options = options || {};
            //console.log('[DEBUG] ChartistPlus::Histogram', selector, data, options, responsiveOptions, pluginOptions);
            let chartType = 'histogram';
            let defaultOptions = new getDefaultOptions(options, data, chartType);

            let chart = new Chartist.Line(selector, data, defaultOptions, responsiveOptions, pluginOptions)
                .on('draw', (context) => {
                    customChartDraw(context, chart, chartType);
                })
                .on('created', (context) => {
                    customChartCreated(context, chart, chartType);
                });
            return chart;
        },
        Scatter(selector, data, options, responsiveOptions, pluginOptions) {
            options = options || {};
            //console.log('[DEBUG] ChartistPlus::Scatter', selector, data, options, responsiveOptions, pluginOptions);

            const reset = (chart, options) => {
                chart.update(chart.data, options);
            };

            let defaultOptions = new getDefaultOptions(options, data);
            let chart = new Chartist.Line(selector, data, defaultOptions, responsiveOptions, pluginOptions)
                .on('draw', function(context){
                    customChartDraw(context, chart);
                })
                .on('created', function(context){
                    customChartCreated(context, chart);
                });
            return chart;
        }
    };

    return ChartistPlus;
}));
