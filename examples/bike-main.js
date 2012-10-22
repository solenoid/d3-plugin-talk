// author : Erik Solen
// license : MIT

// Cache bust all code each full page load.
var _rightNow = +new Date();
require.config({
    urlArgs: 'buster=' + _rightNow
});
require(['jquery', 'lodash', 'matrix'], function ($, _) {
    $.ajax({
        // TODO work off a more raw form of data and
        // prepare data prior to calling the plugin
        url: '/data/prepared-data.js',
        dataType: 'json'
    }).done(function (prepared) {
        var addLabels = function (outer_array, name) {
            var dayLabels = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
            var daysAdded = _.each(outer_array, function (inner_array, i) {
                inner_array.unshift(dayLabels[i]);
            });
            var hourLabels = '12A 1AM 2AM 3AM 4AM 5AM 6AM 7AM 8AM 9AM 10A 11A 12P 1PM 2PM 3PM 4PM 5PM 6PM 7PM 8PM 9PM 10P 11P'.split(' ');
            hourLabels.unshift(name);
            outer_array.unshift(hourLabels);
            return outer_array;
        };
        var data = addLabels(prepared.data, 'Rides');
        $('#viz').matrix({
            // TODO consider having column and row labels not in data itself
            data: data, // TODO calculate
            max: 10508 // TODO calculate
        });
    });
});