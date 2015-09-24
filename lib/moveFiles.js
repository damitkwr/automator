'use strict';

// MODULES //

var async = require( 'async' ),
	fs = require( 'fs-extra' ),
	incrspace = require( 'compute-incrspace' ),
	path = require( 'path' ),
	mkdirp = require( 'mkdirp' );


// MOVE FILES //

/**
* FUNCTION moveFiles( dirPath, acct, nFiles )
*	Move created files to account subdirectory.
*
* @param {String} dirPath - directory path files reside in
* @param {String} acct - account number
* @param {Number} nFiles - number of reports for accout in question
*/
function moveFiles( dirPath, acct, nFiles ) {
	dirPath = path.resolve( dirPath );
	return function( callback ) {
		var targetDir = path.join( dirPath, acct );
		mkdirp( targetDir, function onDirectory( err ) {
			if ( err ) {
				callback( err );
			}
			var files = incrspace( 0, nFiles, 1 )
				.map( function( e ) {
					return acct + '_' + e + '.pdf';
				});

			async.map( files, function( item, callback ) {
				fs.move( path.join( dirPath, item ), path.join( dirPath, acct, item ), function( err ) {
					callback( err );
				});
			}, function( err, results ) {
				callback( err, results );
			});
		});
	};
} // end FUNCTION moveFiles()


// EXPORTS //

module.exports = moveFiles;
