// author : Erik Solen
// license : MIT

// Cache bust all code each full page load.
var _rightNow = +new Date();
require.config({
    urlArgs: 'buster=' + _rightNow
});
require(['jquery', 'matrix'], function ($) {
    $.ajax({
        // TODO work off a more raw form of data and
        // prepare data prior to calling the plugin
        url: '../data/prepared-data.js',
        dataType: 'json'
    }).done(function (prepared) {
        $('#viz').matrix({
            topLabels: 'Rides 12A 1AM 2AM 3AM 4AM 5AM 6AM 7AM 8AM 9AM 10A 11A 12P 1PM 2PM 3PM 4PM 5PM 6PM 7PM 8PM 9PM 10P 11P'.split(' '),
            sideLabels: 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
            data: prepared.data // TODO calculate
        });
    });
});