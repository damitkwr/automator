'use strict';

// MODULES //

var async = require( 'async' ),
	robot = require( 'robotjs' );

async.series([
	function( callback ) {
		robot.moveMouse( 100, 253 );
		setTimeout( callback, 2000 );
	},
	function( callback ) {
		robot.mouseClick();
		setTimeout( callback, 2000 );
	},
	function( callback ) {
		robot.typeString( '3299' );
		setTimeout( callback, 2000 );
	},
	function( callback ) {
		robot.keyToggle( 'enter' );
		setTimeout( callback, 2000 );
	},
]);
