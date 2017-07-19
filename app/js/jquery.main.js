( function(){

    "use strict";

    window.onload = function () {

        new Preloader( $('.preloader') );

    };

    $( function () {

        $.each( $( '.language' ), function () {
            new Language( $( this ) );
        } );

    } );

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

    var Language = function (obj) {

        //private properties
        var _obj = obj,
            _site = $( '.site' ),
            _window = $( window );

        //private methods
        var _construct = function () {

                _onEvent();

            },
            _onEvent = function() {

                _site.on(
                    'click', function ( e ) {

                        if ( _obj.hasClass( 'open' ) && $( e.target ).closest( _obj ).length == 0 ){
                            _closeLanguage();
                        }

                    }
                );

                _obj.on( 'click', function () {

                    var curElem = $( this );

                    if( curElem.hasClass( 'open' ) && _window.width() < 1200 ){
                        _closeLanguage();
                    } else if ( _window.width() < 1200 ) {
                        _openLanguage();
                    }

                } )

            },
            _closeLanguage = function() {
                _obj.removeClass( 'open' );
            },
            _openLanguage = function() {
                _obj.addClass( 'open' )
            };

        //public properties

        //public methods

        _construct();
    };

} )();