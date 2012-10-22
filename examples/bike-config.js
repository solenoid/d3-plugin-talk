require.config({
    enforceDefined: true,
    shim: {
        'jquery': {
            exports: '$'
        },
        'jquery-ui': {
            deps: ['jquery'],
            exports: '$.ui'
        },
        'd3': {
            exports: 'd3'
        },
        'lodash': {
            exports: '_'
        },
        'moment': {
            exports: 'moment'
        }
    },
    paths: {
        // libs
        'jquery': '../libs/jquery/1.8.2/jquery.min',
        'jquery-ui': '../libs/jqueryui/1.9.0/jquery-ui.custom.min',
        'd3': '../libs/d3/2.10.3/d3.v2.min',
        'lodash': '../libs/lodash/0.8.2/lodash.min',
        'moment': '../libs/moment/1.7.2/moment.min',
        // plugins
        'matrix': '../plugins/matrix'
    }
});
