'use strict';

// MODULES //

var async = require( 'async' );
var fs = require( 'fs-extra' );
var glob = require( 'glob' );
var path = require( 'path' );
var textract = require( 'textract' );
var annotate = require( 'notes-extractor' );
var diagDates = require( './diagnosisHash.json' );
var moment = require('moment');
var parseArgs = require( 'minimist' );
require('moment-range');

// ARGUMENTS //

var args = parseArgs( process.argv.slice(2) );

if ( !args.quarters ) {
	throw new Error( 'Number of quarters up to which data shall be extracted has to be specified.' );
}

var REGEX = /(January|February|March|April|May|June|July|August|September|October|November|December)\s*[0-9]{1,2}[,\s]*[0-9]{4}/i;
var REGEX2 = /[0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4}/i

function processDir( dirs, i ) {
	var dir = dirs[i];
	var currentDir = path.resolve( __dirname + '/../_Patients_Finished/' + dir );
	glob( currentDir + '/*.pdf', function( err, files ) {
		async.map( files, textract.fromFileWithPath, function( err, results ) {
			var full = results.map( o => annotate(o).processed_text )
				.filter(  o => o !== undefined );
			var diagnosisDate = moment( diagDates[ dir ] );
			full = full.filter( o => {
					var match;
					match = o.match( REGEX );
					if ( match ) {
						var documentDate  = moment( match[0] );
						var dr = moment.range( diagnosisDate, documentDate );
						return dr.diff('quarters') > args.quarters ? false : true;
					} else {
						match = o.match( REGEX2 );
						if ( match ) {
							var documentDate  = moment( match[0] );
							var dr = moment.range( diagnosisDate, documentDate );
							return dr.diff('quarters') > args.quarters ? false : true;
						}
					}
					return false;
				});
			var txt = full.join( ' ' );
			fs.writeFileSync( path.resolve( __dirname + '/../R Analyses/periods/' + args.quarters + '_Quarters/' + dir + '.txt' ), txt );
			if ( i < dirs.length ) {
				processDir( dirs, i+1 );
			}
		});
	});
}

fs.readdir( './../_Patients_Finished', function( err, dirs ) {
	processDir( dirs, 0 );
});
