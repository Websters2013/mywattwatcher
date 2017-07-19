( function(){

    "use strict";

    $( function () {

        $.each( $( '.graph__pts' ), function () {
            new ViewResult( $( this ) );
        } );

    } );

    var ViewResult = function (obj) {

        //private properties
        var _obj = obj;

        //private methods
        var _onEvent = function () {

            },
            _getResult = function () {

                var data = localStorage.getItem( 'totalValue' );

                if ( data != null ) {

                    return data;

                } else {
                    return '0';
                }

            },
            _setResult = function () {

                _obj.text( _getResult() +' pts' )

            },
            _construct = function () {

                _setResult();
                _onEvent();

            };

        //public properties

        //public methods

        _construct();
    };

} )();