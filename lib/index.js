'use strict';

// MODULES //

var async = require( 'async' ),
	extractAcct = require( './extractAcct.js' ),
	fs = require( 'fs' );


var accts = fs.readFileSync( 'abc.txt' )
	.toString()
	.split( '\n' );

var skip = process.argv[2] || 0;

console.log( accts[ skip ] );
extractAcct( accts[ skip ]);

/*
for ( var i = skip; i < accts.length; i++ ) {

}
*/
