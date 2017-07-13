( function(){

    "use strict";

    window.onload = function () {

        new Preloader( $('.preloader') );

    };

    var Preloader = function (obj) {

        //private properties
        var _self = this,
            _window = $( window ),
            _html = $('html'),
            _preloader = obj,
            _body = $('body');

        //private methods
        var _init = function () {

                _body[0].preloader = _self;
                _showSite();

            },
            _showSite = function() {

                _preloader.addClass( 'preloader_loaded' );

                setTimeout( function() {

                    _html.css( {
                        'overflow-y': 'auto'
                    } );

                    _preloader.remove();

                    $('.site').addClass( 'site__loaded' );

                }, 500 );
            };

        //public properties

        //public methods


        _init();
    };

} )();