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
            _categoryFormUser = _categoryFormQuestions.find( 'form' ),
            _totalSumFieldset = _categoryFormQuestions.find( '#totalSum' ),
            _circle = $( '.circle' ),
            _curStep = _circle.find( '.circle__cur-step' ),
            _numStep = _circle.find( '.circle__num-steps' ),
            _canvas = document.createElement( 'canvas' ),
            _ctx = _canvas.getContext( '2d' ),
            _number,
            _totalValue = 0,
            _duration = 500,
            _canDraw = true,
            _canAnimate = true,
            _currentAngle = 0,
            _body = $( 'html, body'),
            _window = $( window ),
            _request = new XMLHttpRequest();

        //private methods
        var _onEvent = function () {

                _itemCategoryBtn.on( 'click', function () {

                    var curItem = $( this ),
                        curItemLink = curItem.data( 'link' );

                    _ajaxRequest( curItemLink );

                    _body.animate( {
                        scrollTop: _circle.offset().top + 5

                    } );

                    return false;

                } );

            },
            _ajaxRequest = function ( link ) {

                _request = $.ajax( {
                    url: link,
                    dataType: 'json',
                    timeout: 20000,
                    type: 'GET',
                    success: function ( data ) {

                        setTimeout(function () {

                            _createForm( data );

                        },150);

                    },
                    error: function ( XMLHttpRequest ) {
                        if ( XMLHttpRequest.statusText != "abort" ) {
                            console.log( 'err' );
                        }
                    }
                } );

            },
            _clearLocalStorage = function () {
                localStorage.removeItem( 'totalValue' )
            },
            _createForm = function ( data ) {

                var categoryTitle = data.title,
                    categoryQuestions = data.questions,
                    categoryTitleItem = _categoryFormQuestions.find( '.site__title' ),
                    questionItem;

                categoryTitleItem.text( categoryTitle );

                $.each( categoryQuestions, function() {

                    var curElem = this;

                    questionItem = _createItemQuestion( curElem, categoryTitle );

                    questionItem.insertBefore( _categoryFormUser );

                } );

                _showQuestionForm();

            },
            _createItemQuestion = function ( data, title ) {

                var curData = data,
                    categoryTitle = title,
                    questionFrame = $( '<div class="choose-category__form-layout"></div>' );

                for( var i = 0; i < curData.length; i++ ){

                    var curOption = curData[i].option,
                        curValue = curData[i].value;

                    questionFrame.append( '<label class="nice-radio">'+
                        '<input type="radio" name="'+ categoryTitle +''+ i +'" id="id-'+ i +'" value="'+ curValue +'"/>'+
                        '<span>'+ curOption +'</span></label>' );

                }

                return questionFrame;

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
            _showQuestionForm = function () {

                var itemQuestion = _categoryFormQuestions.find( '.choose-category__form-layout' ),
                    itemNumber = itemQuestion.length;

                _obj.css( 'height', _layoutCategory.outerHeight() );

                _layoutCategory.addClass( 'hide' );
                _categoryFormQuestions.addClass( 'show' );

                _numStep.text( itemNumber );

                _categoryFormQuestions.css( 'height', itemQuestion.eq( 0 ).outerHeight() );
                _obj.css( 'height', itemQuestion.eq( 0 ).outerHeight() );
                itemQuestion.eq( 0 ).removeClass( 'hide' ).addClass( 'show' );

                _number = 100 / itemNumber;

                _loop();
                _addCanvas();

                _checkOption( itemQuestion );

            },
            _checkOption = function ( elem ) {

                var curItem = elem,
                    itemQuestionOption = curItem.find( 'input[ type = radio ]' );

                itemQuestionOption.on( 'change', function () {

                    var curItem = $( this ),
                        curValue = +( curItem.val() ),
                        curFrameParent = curItem.parents( '.choose-category__form-layout' ),
                        nextFrameParent = curFrameParent.next( '.choose-category__form-layout' ),
                        nextFrameParentIndex = nextFrameParent.index(),
                        curFormParent = curItem.parents( '.choose-category__form' ),
                        numFormQuestion = curFormParent.find( '.choose-category__form-layout' ).length;

                    _totalValue = + _totalValue + curValue;

                    localStorage.setItem( 'totalValue', _totalValue );
                    _totalSumFieldset.val( _totalValue );

                    _curStep.text( nextFrameParentIndex );

                    _number = ( nextFrameParentIndex ) * 100 / numFormQuestion;

                    _render();

                    curFrameParent.removeClass( 'show' );
                    nextFrameParent.addClass( 'show' );

                    _categoryFormQuestions.css( 'height', nextFrameParent.outerHeight() );
                    _obj.css( 'height', nextFrameParent.outerHeight() );

                    if ( _window.outerWidth() < 768 ){

                        _body.animate( {
                            scrollTop: _circle.offset().top + 5

                        } );

                    }

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

                _clearLocalStorage();
                _onEvent();

            };

        //public properties

        //public methods

        _construct();
    };

} )();