define(['d3', 'nvd3', 'underscore', 'views/discrete-bar-view'],
    function(d3, nvd3, _, DiscreteBarView) {
        'use strict';

        var StackedBarView = DiscreteBarView.extend({

            defaults: _.extend({}, DiscreteBarView.prototype.defaults, {
                barSelector: '.nv-bar',
                truncateXTicks: false,
                interactiveTooltipValueTemplate: function(trend) {
                        /* Translators: <%=value%> will be replaced by a number followed by a percentage.
                         For example, "400 (29%)" */
                    return _.template(gettext('<%=value%> (<%=percent%>)'))({
                        value: trend.value,
                        percent: d3.format('.1%')(trend.point[trend.options.percent_key])
                    });
                },
                click: function(d) {
                    if (_(d).has('url')) {
                        document.location.href = d.url;
                    }
                },
                x: {key: 'id', displayKey: 'name'},
                y: {key: 'count'}
            }
            ),

            getChart: function() {
                return nvd3.models.multiBarChart();
            },

            initChart: function(chart) {
                var self = this;
                DiscreteBarView.prototype.initChart.call(self, chart);

                chart.stacked(true)
                    .showControls(false)
                    .showLegend(false)
                    .reduceXTicks(false);  // shows all ticks

                chart.tooltip.contentGenerator(function(o) {
                    var tips = [];
                    _(self.options.trends).each(function(trend) {
                        tips.push(self.buildTrendTip(trend, o));
                    });

                    return self.hoverTooltipTemplate({
                        xValue: self.buildTipHeading(o.data),
                        tips: tips
                    });
                });
            }

        });

        return StackedBarView;
    });
