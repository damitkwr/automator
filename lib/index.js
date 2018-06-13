'use strict';

// MODULES //

var async = require( 'async' ),
	extractAcct = require( './extractAcct.js' ),
	fs = require( 'fs' );


var accts = fs.readFileSync( './data/accts.txt' )
	.toString()
	.split( '\n' )
	.map( function( id ) {
		return parseInt( id, 10 );
	});

// Parse user-supplied account id of current patient:
var current = parseInt( process.argv[2] || 0, 10 );

console.log( accts[ current ] );
extractAcct( accts[ current ], function onDone() {
	current += 1;
	console.log( accts[ current ] );
	extractAcct( accts[ current ], onDone );
});
