'use strict';

// MODULES //

var async = require( 'async' ),
	robot = require( 'robotjs' );


// FUNCTIONS //

function hitEnter( callback ) {
	robot.keyTap( 'enter' );
	setTimeout( callback, 1000 );
}

function clickMouse( callback ) {
	robot.mouseClick();
	setTimeout( callback, 1000 );
}

function doubleClick( callback ) {
	robot.mouseClick( 'left', true );
	setTimeout( callback, 1000 );
}

function typeString( str ) {
	return function( callback ) {
		robot.typeString( str );
		setTimeout( callback, 1000 );
	};
}

function move( x, y ) {
	return function( callback ) {
		robot.moveMouse( x, y );
		setTimeout( callback, 1000 );
	};
}

function downloadDoc( id ) {
	return function( callback ) {
		async.series([
			move( 32, 218 + id * 30 ),
			clickMouse,
			move( 701, 725 ),
			clickMouse,
			move( 611, 569 ),
			clickMouse,
			move( 471, 374 ),
			clickMouse,
			move( 412, 383 ),
			clickMouse,
			move( 513, 263 ),
			doubleClick,
			move( 522, 311 ),
			doubleClick,
			move( 506, 330 ),
			doubleClick,
			move( 607, 535 ),
			clickMouse,
			typeString( '3299_' + id ),
			move( 880, 535 ),
			clickMouse,
			move( 519, 287 ),
			clickMouse
		], function() {
			if  ( robot.getPixelColor( 56, 248 ) !== 'e2edf7' ) {
				setTimeout( downloadDoc( id++ ), 2000 );
			} else {
				setTimeout( callback, 2000 );
			}
		});
	};
}

// SERIES OF COMMANDS //

async.series([
	move( 100, 253),
	clickMouse,
	typeString( '3299' ),
	hitEnter,
	move( 96, 56 ),
	hitEnter,
	move( 176, 167 ),
	clickMouse,
	move( 375, 158 ),
	clickMouse,
	typeString( 'f' ),
	typeString( 'o' ),
	typeString( 'l' ),
	typeString( 'l' ),
	typeString( 'o' ),
	typeString( 'w' ),
	typeString( '-' ),
	typeString( 'u' ),
	typeString( 'p' ),
	downloadDoc( 0 )
]);
