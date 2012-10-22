// author : Erik Solen
// license : MIT
define(['jquery', 'lodash', 'd3', 'jquery-ui'], function ($, _, d3) {

    $.widget('ui.matrix', {

        options: {
            // default min-width applied to data cells
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

        // Data is assumed to be a 2 dimensional array with all inner arrays the same length.
        // An appropriate data max is assumed to be passed in too.
        // Labels for the top headers are the first row.
        // Labels for individual rows are the first element in the inner arrays.
        // All labels and values will be html escaped.
        _init: function () {
            var self = this,
                tableHeaderRow,
                tableRows,
                // first row has header labels html escaped
                escapedTopHeaderData = _.map(_.first(self.options.data), function (label) { return _.escape(label); }),
                // the rest has data starting with row labels
                data = _.rest(self.options.data),
                dataWidth = escapedTopHeaderData.length,
                dataHeight = data.length,
                colorScale = d3.scale.linear()
                    .domain([0, self.options.max])
                    .range([0, 1]),
                table = self.element.append('<table></table').find('table:last');
            self.formatter = self.options.format || self.kFormat;
            tableHeaderRow = '<tr class="labels"><th>' +
                escapedTopHeaderData.join('</th><th>') +
                '</th></tr>';
            tableRows = _.map(data, function (row, height_index) {
                var cells = _.map(row, function (val, width_index) {
                    var scaledColor,
                        colorVal = val,
                        firstCell = (width_index === 0),
                        lastCell = (width_index === (dataWidth - 1)),
                        lastRow = (height_index === (dataHeight - 1)),
                        cellWidthStyle = 'min-width:' + self.options.cellWidth + ';';
                    // treat the first element in the array as a label
                    if (firstCell) {
                        return '<th>' + _.escape(val) + '</th>';
                    }
                    // don't show null or undefined values
                    if (val != null) {
                        // scale color value down when it is an aggregated overall
                        if (lastCell && self.options.aggregated) {
                            colorVal = colorVal / dataWidth;
                        }
                        if (lastRow && self.options.aggregated) {
                            colorVal = colorVal / dataHeight;
                        }
                        scaledColor = self.options.color(colorScale(colorVal));
                        return '<td style="' + cellWidthStyle + 'background:' + scaledColor + ';">' +
                            self.formatter(val) +
                            '</td>';
                    }
                    return ('<td style="' + cellWidthStyle + 'background:#fff;">&mdash;</td>');
                }).join('\n');
                return '<tr class="labels">' + cells + '</tr>';
            }).join('\n');
            table.append(tableHeaderRow + tableRows);
        }

    });

});
