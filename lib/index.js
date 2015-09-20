'use strict';

// MODULES //

var robot = require( 'robotjs' );

//Move the mouse to 100, 100 on the screen.
robot.moveMouse( 100, 253 );
robot.mouseClick();

setTimeout( function() {
	robot.typeString( '3299' );
	robot.keyToggle( 'enter' );
}, 5000);
