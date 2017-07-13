( function(){

    "use strict";

    $( function () {

        $.each( $( '.choose-category' ), function () {
            new ChooseCategory( $( this ) );
        } );

    } );

    var ChooseCategory = function (obj) {

        //private properties
        var _obj = obj,
            _itemCategoryBtn = _obj.find( '.choose-category__item' ),
            _layoutCategory = _obj.find( '.choose-category__layout' ),
            _categoryFormQuestions = _obj.find( '.choose-category__form' ),
            _circle = $( '.circle' ),
            _curStep = _circle.find( '.circle__cur-step' ),
            _numStep = _circle.find( '.circle__num-steps' ),
            _canvas = document.createElement( 'canvas' ),
            _ctx = _canvas.getContext( '2d' ),
            _number,
            _duration = 500,
            _canDraw = true,
            _canAnimate = true,
            _currentAngle = 0;

        //private methods
        var _onEvent = function () {

                _itemCategoryBtn.on( 'click', function () {

                    var curItem = $( this );

                    _showQuestionForm( curItem );

                    return false;

                } );

            },
            _addCanvas = function() {

                _circle.addClass( 'show' );

                _canvas.width = _canvas.height = _circle.outerWidth();

                var gradient=_ctx.createLinearGradient( 0, 0, _canvas.width / 2,0 );

                gradient.addColorStop( "0", "#fd5353" );
                gradient.addColorStop( "1.0", "#ec4545" );

                _ctx.translate( _canvas.width / 2, _canvas.height / 2 );
                _ctx.strokeStyle = gradient;
                _ctx.lineWidth = 8;
                _circle.prepend( _canvas );

                $( _canvas ).width( _circle.height() + 4 );
                $( _canvas ).height( _circle.height() + 4 );

            },
            _showQuestionForm = function ( elem ) {

                var curItem = elem,
                    curFormId = curItem.data( 'form-id' ),
                    curForm = _categoryFormQuestions.filter( '[data-form-id="'+ curFormId +'"]' ),
                    itemQuestion = curForm.find( '.choose-category__form-layout' ),
                    itemNumber = itemQuestion.length;

                _obj.css( 'height', _layoutCategory.outerHeight() );

                _layoutCategory.addClass( 'hide' );
                curForm.addClass( 'show' );

                _numStep.text( itemNumber );

                curForm.css( 'height', itemQuestion.eq( 0 ).outerHeight() );
                _obj.css( 'height', itemQuestion.eq( 0 ).outerHeight() );
                itemQuestion.eq( 0 ).removeClass( 'hide' ).addClass( 'show' );

                _number = 100 / itemNumber;

                _loop();
                _addCanvas();

                _checkOption( itemQuestion, curForm );

            },
            _checkOption = function ( elem, form ) {

                var curForm = form,
                    curItem = elem,
                    itemQuestionOption = curItem.find( 'input[ type = radio ]' );

                itemQuestionOption.on( 'change', function () {

                    var curItem = $( this ),
                        curFrameParent = curItem.parents( '.choose-category__form-layout' ),
                        nextFrameParent = curFrameParent.next( '.choose-category__form-layout' ),
                        curFormParent = curItem.parents( '.choose-category__form' ),
                        numFormQuestion = curFormParent.find( '.choose-category__form-layout' ).length;

                    _curStep.text( nextFrameParent.index() + 1 );

                    _number = ( nextFrameParent.index() + 1 ) * 100 / numFormQuestion;

                    _render();

                    curFrameParent.removeClass( 'show' );
                    nextFrameParent.addClass( 'show' );

                    curForm.css( 'height', nextFrameParent.outerHeight() );
                    _obj.css( 'height', nextFrameParent.outerHeight() );

                } )

            },
            _loop = function (){

                if( _canAnimate && _canDraw && _number !== 0 ) {
                    _render();
                    _canAnimate = false;
                }

            },
            _render = function(){

                var range = _number,
                    increment = _number > 0? 1 : -1,
                    stepTime = Math.abs( Math.floor( _duration / range ) ),
                    timer;

                timer = setInterval( function() {

                    _currentAngle += increment;

                    _ctx.clearRect( -( _canvas.width/2 ), - ( _canvas.height/2 ), _canvas.width, _canvas.height );
                    _ctx.beginPath();
                    _ctx.arc( 0, 0, ( _canvas.height - 20 )/2, _gradToRad( 270 ), _gradToRad( 270 + ( ( _currentAngle/100 ) * 360 ) ) );

                    _ctx.stroke();

                    if ( _currentAngle >= range ) {
                        clearInterval( timer );
                    }

                    if ( range >= 100 ){
                        _circle.find( 'div' ).addClass( 'all' );
                    }

                }, stepTime );

                _canAnimate = false;
                _canDraw = false;

            },
            _gradToRad = function( grad ){

                return grad * Math.PI / 180;

            },
            _construct = function () {

                _onEvent();

            };

        //public properties

        //public methods

        _construct();
    };

} )();