'use strict';

// MODULES //

var async = require( 'async' ),
	robot = require( 'robotjs' ),
	fs = require( 'fs-extra' ),
	incrspace = require( 'compute-incrspace' ),
	path = require( 'path' ),
	mkdirp = require( 'mkdirp' );


// VARIABLES //

var CURRENT_DOC_INDEX;


// CONSTANTS //

var SAVE_PATH = './../Patients';


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

function downloadDocs( acctId ) {
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
				typeString( acctId + '-' + CURRENT_DOC_INDEX ),
				move( 880, 535 ),
				clickMouse,
				move( 519, 287 ),
				clickMouse
			], function() {
				CURRENT_DOC_INDEX++;
				if  ( robot.getPixelColor( 56, 217 + (id+1) * 28 ) !== 'e2edf7' ) {
					id += 1;
					setTimeout( downloadDoc( id ), 2000 );
				} else {
					setTimeout( callback, 2000 );
				}
			});
		}
		if  ( robot.getPixelColor( 56, 217 ) !== 'e2edf7' ) {
			downloadDoc( 0 )
		} else {
			setTimeout( callback, 2000 );
		}
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
		downloadDocs( acctId ),
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
		downloadDocs( acctId ),
		moveFiles( SAVE_PATH, acctId.toString() ),
		move( 35, 56 ),
		clickMouse,
		clickMouse,
		clickMouse
	]);
} // end FUNCTION extractAcct()


// MOVE FILES //

/**
* FUNCTION moveFiles( dirPath, acct, nFiles )
*	Move created files to account subdirectory.
*
* @param {String} dirPath - directory path files reside in
* @param {String} acct - account number
*/
function moveFiles( dirPath, acct ) {
	dirPath = path.resolve( dirPath )
	return function( callback ) {
		var targetDir = path.join( dirPath, acct );
		console.log( CURRENT_DOC_INDEX )
		mkdirp( targetDir, function onDirectory( err ) {
			if ( err ) {
				callback( err );
			}
			var files = incrspace( 0, CURRENT_DOC_INDEX, 1 )
				.map( function( e ) {
					return acct + '-' + e + '.pdf';
				});

			async.map( files, function( item, callback ) {
				fs.move( path.join( dirPath, item ), path.join( dirPath, acct, item ), function( err ) {
					callback( err );
				});
			}, function( err, results ) {
				if ( callback ) callback( err, results );
			});
		});
	};
} // end FUNCTION moveFiles()


// EXPORTS //

module.exports = extractAcct;
