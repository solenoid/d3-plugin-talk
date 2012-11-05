// author : Erik Solen
// license : MIT
(function (factory) {
    // UMD pattern.
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'lodash', 'd3', 'jquery-ui'], factory);
    } else {
        // Browser globals which will complain if you try to override.
        /*global jQuery:false, _:false, d3:false */
        factory(jQuery, _, d3);
    }
}(function ($, _, d3) {

    $.widget('ui.matrix', {

        options: {
            // default width applied to data cells
            cellWidth: '32px',
            // explicity state if the overall column and row is aggregated
            aggregated: false,
            color: d3.interpolateHsl("hsl(273, 38%, 100%)", "hsl(273, 38%, 55%)")
        },

        // common formats
        _noDecimal: d3.format(',f'),
        _onePlace: d3.format(',.1f'),

        // returns a formatted number with a k, m or b suffix as needed

        //     1.234         ->      '1'
        //     123           ->    '123'
        //     1234          ->   '1.2k'
        //     12345         ->    '12k'
        //     4512312       ->   '4.5m'
        //     67123123      ->  '67.1m'
        //     7812312312    ->   '7.8b'
        //     189123123123  ->   '189b'
        //     2189123123123 -> '2,189b'
        kFormat: function (n) {
            if (n < 1000) { return _.escape(n); }
            if (n < 10000) { return this._onePlace(n / 1000) + 'k'; }
            if (n < 1000000) { return this._noDecimal(n / 1000) + 'k'; }
            if (n < 100000000) { return this._onePlace(n / 1000000) + 'm'; }
            if (n < 1000000000) { return this._noDecimal(n / 1000000) + 'm'; }
            if (n < 100000000000) { return this._onePlace(n / 1000000000) + 'b'; }
            return this._noDecimal(n / 1000000000) + 'b';
        },

        // Data is assumed to be a 2 dimensional array with all rows the same length.
        // Labels _optional_ for the top and side are separate from the data and will be html escaped.
        _init: function () {
            var self = this,
                dataRows,
                dataCells,
                data = _.clone(self.options.data, true),
                dataWidth = data[0].length,
                dataHeight = data.length,
                max = d3.max(_.flatten(data)),
                interpolate = self.options.color,
                scale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, 1]);
            self.formatter = self.options.format || self.kFormat;

            // Poke side labels into the data
            _.each(data, function (row, i) {
                row.unshift(self.options.sideLabels[i]);
            });

            // ## Header Row
            // DATA JOIN + ENTER
            d3.select(self.element[0]).select('table thead').selectAll('th')
                .data(self.options.topLabels)
                .enter().append('th')
                .text(function (d) { return d; });

            // Explanation of Nested Selection
            // http://bost.ocks.org/mike/nest/
            // Explanation of DATA JOIN, ENTER, UPDATE and EXIT
            // http://bl.ocks.org/3808218

            // ## Rows
            // DATA JOIN
            dataRows = d3.select(self.element[0]).select('table tbody').selectAll('tr')
                .data(data);

            // ENTER
            dataRows.enter().append('tr');

            // EXIT
            dataRows.exit().remove();

            // ## Cells
            // DATA JOIN
            dataCells = dataRows.selectAll('td')
                .data(function (d) { return d; });

            // ENTER
            dataCells.enter().append('td');

            // UPDATE
            dataCells.style({
                    width: self.options.cellWidth,
                    background: function (d, i, j) {
                        var val = d,
                            lastCell = (i === dataWidth), // row labels were added
                            lastRow = (j === dataHeight - 1);
                        if (lastCell && self.options.aggregated) {
                            val = val / dataWidth;
                        }
                        if (lastRow && self.options.aggregated) {
                            val = val / dataHeight;
                        }
                        return interpolate(scale(val));
                    }
                })
                .html(function (d, i) {
                    if (i === 0) {
                        return _.escape(d);
                    }
                    if (d != null) {
                        return '<div>' + self.formatter(d) + '</div>';
                    }
                    return '&mdash;';
                });
        },

        // Called once the first time this plugin is used for an element.
        _create: function () {
            var self = this;
            self.element.html('<table><thead><tr></tr></thead><tbody></tbody></table');
        }

    });

}));
