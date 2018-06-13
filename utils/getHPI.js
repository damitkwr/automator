'use strict';

var async = require( 'async' );
var fs = require( 'fs-extra' );
var glob = require( 'glob' );
var path = require( 'path' );
var textract = require( 'textract' );
var annotate = require( 'notes-extractor' );

function processDir( dirs, i ) {
	var dir = dirs[i];
	var currentDir = path.resolve( __dirname + '/../_Patients_Finished/' + dir );
	glob( currentDir + '/*.pdf', function( err, files ) {
		async.map( files, textract.fromFileWithPath, function( err, results ) {
			var annotations = results.map( o => annotate(o).annotations.hpi.text )
				.filter(  o => o !== undefined );
			var txt = annotations.join( ' ' );
			fs.writeFileSync( path.resolve( __dirname + '/../hpi/' + dir + '.txt' ), txt );
			if ( i < dirs.length ) {
				processDir( dirs, i+1 );
			}
		});
	});
}

fs.readdir( './../_Patients_Finished', function( err, dirs ) {
	processDir( dirs, 0 );
});
