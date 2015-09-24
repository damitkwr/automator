'use strict';

// MODULES //

var async = require( 'async' ),
	robot = require( 'robotjs' ),
	moveFiles = require( './moveFiles.js' );


// VARIABLES //

var CURRENT_DOC_INDEX;


// CONSTANTS //

var SAVE_PATH = '~/Documents/Sonal_CMU_Project/Patients';


// FUNCTIONS //

function hitDelete( times ) {
	return function( callback ) {
		async.times( times, function( n, next ) {
			robot.keyTap( 'backspace' );
			setTimeout( next, 500 );
		}, function() {
			setTimeout( callback, 2000 );
		});
	};
}

function hitEnter( callback ) {
	robot.keyTap( 'enter' );
	setTimeout( callback, 2000 );
}

function clickMouse( callback ) {
	robot.mouseClick();
	setTimeout( callback, 2000 );
}

function doubleClick( callback ) {
	robot.mouseClick( 'left', true );
	setTimeout( callback, 2000 );
}

function typeString( str ) {
	return function( callback ) {
		robot.typeString( str );
		setTimeout( callback, 2000 );
	};
}

function move( x, y ) {
	return function( callback ) {
		robot.moveMouse( x, y );
		setTimeout( callback, 2000 );
	};
}

function downloadDocs( startID, acctId ) {
	return function( callback ) {
		function downloadDoc( id ) {
			async.series([
				move( 32, 217 + id * 28 ),
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
				typeString( acctId + '_' + id ),
				move( 880, 535 ),
				clickMouse,
				move( 519, 287 ),
				clickMouse
			], function() {
				if  ( robot.getPixelColor( 56, 217 + (id+1) * 28 ) !== 'e2edf7' ) {
					id += 1;
					CURRENT_DOC_INDEX++;
					setTimeout( downloadDoc( id ), 1000 );
				} else {
					setTimeout( callback, 1000 );
				}
			});
		}
		downloadDoc( startID );
	};
}


/**
* FUNCTION extractAcct( acctId )
*	Extract doctor's reports for account with supplied id and
*	save them to disk.
*
* @param {Number} acctId - id of the patient
*/
function extractAcct( acctId ) {

	CURRENT_DOC_INDEX = 0;

	// SERIES OF COMMANDS //
	async.series([
		move( 100, 253),
		clickMouse,
		typeString( acctId ),
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
		downloadDocs( CURRENT_DOC_INDEX, acctId ),
		move( 435, 158 ),
		clickMouse,
		hitDelete( 9 ),
		typeString( 'f' ),
		typeString( 'o' ),
		typeString( 'l' ),
		typeString( 'l' ),
		typeString( 'o' ),
		typeString( 'w' ),
		typeString( ' ' ),
		typeString( 'u' ),
		typeString( 'p' ),
		downloadDocs( CURRENT_DOC_INDEX, acctId ),
		moveFiles( SAVE_PATH, acctId, CURRENT_DOC_INDEX ),
		move( 35, 56 ),
		clickMouse,
		clickMouse,
		clickMouse
	]);
} // end FUNCTION extractAcct()


// EXPORTS //

module.exports = extractAcct();
