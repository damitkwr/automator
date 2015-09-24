'use strict';

// MODULES //

var fs = require( 'fs' ),
	path = require( 'path' ),
	mkdirp = require( 'mkdirp' ),
	spawn = require('child_process').spawn;


// MOVE FILES //


function moveFiles( acct, dirPath ) {
	dirPath = path.resolve( dirPath );
	return function( callback ) {
		var targetDir, mv;
		targetDir = path.join( dirPath, acct );
		console.log( targetDir );
		mkdirp( targetDir, function onDirectory( err ) {
			console.log( dirPath + '/*.pdf' )
			mv = spawn( 'mv', [ dirPath + '/*.pdf', targetDir ] );
			mv.stdout.on('data', function (data) {
				console.log('stdout: ' + data);
			});
			mv.stderr.on('data', function (data) {
				console.log('stderr: ' + data);
			});

		});
	};
}


moveFiles( 'argh', './examples' )();

// EXPORTS //

module.exports = moveFiles;
