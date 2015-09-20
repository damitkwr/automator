'use strict';

// MODULES //

var async = require( 'async' ),
	robot = require( 'robotjs' );


// FUNCTIONS //

function hitEnter( callback ) {
	robot.keyTap( 'enter' );
	setTimeout( callback, 2000 );
}

function clickMouse( callback ) {
	robot.mouseClick();
	setTimeout( callback, 2000 );
}

function typeString( str ) {
	return function( callback ) {
		robot.typeString( str );
		setTimeout( callback, 2000 );
	};
}

function downloadDoc( id ) {
	return function( callback ) {
		async.series([
			function( clbk ) {
				robot.moveMouse( 32, 215 );
				setTimeout( clbk, 2000 );
			},
			clickMouse
		], function() {
			setTimeout( callback, 2000 );
		});
	};
}

// SERIES OF COMMANDS //

async.series([
	function( callback ) {
		robot.moveMouse( 100, 253 );
		setTimeout( callback, 2000 );
	},
	clickMouse,
	typeString( '3299' ),
	hitEnter,
	function( callback ) {
		robot.moveMouse( 96, 56 );
		setTimeout( callback, 2000 );
	},
	hitEnter,
	function( callback ) {
		robot.moveMouse( 176, 167 );
		setTimeout( callback, 2000 );
	},
	clickMouse,
	function( callback ) {
		robot.moveMouse( 392, 168 );
		setTimeout( callback, 2000 );
	},
	typeString( 'follow-up' ),
	downloadDoc( 0 )
]);
