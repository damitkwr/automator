'use strict';

// MODULES //

var fs = require( 'fs' ),
	path = require( 'path' ),
	spawn = require('child_process').spawn;


// CONSTANTS //

var SAVE_PATH = '~/Documents/Sonal_CMU_Project/Patients';


// MOVE FILES //


function moveFiles( acct ) {
	return function( callback ) {
		var targetDir, mv;
		targetDir = path.join( SAVE_PATH, acct );
		console.log( targetDir );
		fs.makeDir( targetDir, function onDirectory() {
			mv = spawn( 'mv', [ SAVE_PATH + '/' + acct + '*.pdf', targetDir ]);
		});
	};
}


moveFiles( '3299' )();

// EXPORTS //

module.exports = moveFiles;
