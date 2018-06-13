'use strict';

var async = require( 'async' );
var fs = require( 'fs-extra' );
var glob = require( 'glob' );
var path = require( 'path' );
var textract = require( 'textract' );
var parseArgs = require( 'minimist' );
var diagnoses = require( './diagnoses.json' );
var groups = require( './groupsHash.json' );
var argmin = require( 'compute-argmin' );
var isArray = require( 'validate.io-array' );


// ARGUMENTS //

var args = parseArgs( process.argv.slice(2) );


// PROCESS //

function processDir( dirs, i ) {
	var dir = dirs[i];
	var currentDir = path.resolve( __dirname + '/../_Patients_Finished/' + dir );
	var original;

	glob( currentDir + '/*.pdf', function( err, files ) {

		async.map( files, textract.fromFileWithPath, function( err, results ) {
            for ( var j = 0; j < results.length; j++ ) {
                var author = fetchAuthor( results[j] );
			    var assess = fetchAssessment( results[j], author );
                var arr = assess.split( /[!.;?]/ );
                arr.forEach( check );
            }

			if ( i < dirs.length ) {
				processDir( dirs, i+1 );
			}

            function check( str ) {
                if ( str.indexOf( args.word ) > -1 ) {
					console.log( results[ j ] );
                    console.log( '########');
					original = str.replace( /([^\s]*)_[A-Z0-9]*/gi, '$1' );
                    console.log( original );
					console.log( '#########');
                }
            }
		});
	});
}

fs.readdir( './../_Patients_Finished', function( err, dirs ) {
	// Only keep directories of users of the specified group...
	dirs = dirs.filter( function(x) {
		return groups[ x ] === args.group ? true : false;
	});
	processDir( dirs, 0 );
});


function fetchAuthor( text ) {
		var doctors = [
			'ALLEN I. WOLFERT',
			'CYNTHIA WEST',
			'ELIAS BAHTA',
			'JAMES E. MCCANN',
			'JOSHUA C. SYSAK',
			'MATTHEW PESACRETA',
			'NIRAV D. PATEL',
			'QIZHI XIE',
			'AMEET J. KARAMBELKAR',
			'PRADIP R. TEREDESAI'
		];
		var res;
		for ( var i = 0; i < doctors.length; i++ ) {
			if ( text.match( new RegExp( doctors[i], 'i' ) ) ) {
				res = doctors[i];
				break;
			}
		}
		return res;
}

function fetchHPI( text, author) {
   var match;
   switch ( author ) {
   case 'ALLEN I. WOLFERT':
   case 'CYNTHIA WEST':
   case 'ELIAS BAHTA':
   case 'JAMES E. MCCANN':
   case 'JOSHUA C. SYSAK':
   case 'MATTHEW PESACRETA':
   case 'NIRAV D. PATEL':
   case 'QIZHI XIE':
       match = /HPI: ([\s\S]+)Vitals:/i.exec( text );
   break;
   case 'AMEET J. KARAMBELKAR':
       match = /(Your patient[\s\S]+)Vitals:/i.exec( text );
   break;
   case 'PRADIP R. TEREDESAI':
       match = /(I saw your patient,[\s\S]+)review[ed]*/i.exec( text );
   break;
   }
   if ( match ) {
       return( match[ 1 ] );
   }
   return '';
}

function fetchAssessment( text ) {
	var match;

	match = /[Aa]ssessment[\s]*(?:and)*[\s]*Plan:([\s\S]+)/i.exec( text );
	if ( !match ) {
		match = /[Aa]ssessment:([\s\S]+)Plan:/i.exec( text );
	}
	var sectionsSplitter = /\n\d\.[^\d]/g;
	if ( match ) {
		var parts = match[ 0 ].split( sectionsSplitter );
		for ( var i = 0; i < parts.length; i++ ) {
			parts[ i ] = annotateDiagnosis( parts[ i ] );
		}
		return parts.join( ' ' );
	}
	return '';
}

function annotateDiagnosis( text ) {
	var i;
	var positions = [];
	for ( i = 0; i < diagnoses.length; i++ ) {
		var diagRegExp = new RegExp( diagnoses[ i ], 'i' );
		var pos = text.search( diagRegExp );
		if ( pos === -1 ) {
			pos = 9999;
		}
		positions.push( pos );
	}
	var minIndex = argmin( positions );
	if ( isArray( minIndex ) ) {
		minIndex = minIndex[ 0 ];
	}
	var diag = diagnoses[ minIndex ];
	if ( !diag ) {
		console.log( '______________' );
		console.log( 'Text: ' + text );
	}
	switch ( diag ) {
	case 'Anemia':
		text = text.replace( /(?:285.9 )*Anemia/i, '' );
		return text.replace( /[\w-]+/gi, '$&_anemia' );
	case 'Diabetes':
		text = text.replace( /(?:250.00|250.40)*Diabetes/i, '' );
		return text.replace( /[\w-]+/gi, '$&_dm' );
	case 'Hyperlipidemia':
		text = text.replace( /(?:272.4 )*Hyperlipidemia/i, '' );
		return text.replace( /[\w-]+/gi, '$&_hl' );
	case 'Hypophosphatemia':
		text = text.replace( /(?:272.4 )*Hypophosphatemia/i, '' );
		return text.replace( /[\w-]+/gi, '$&_hyp' );
	case 'Acidosis':
		text = text.replace( /(?:276.2 )*Acidosis/i, '' );
		return text.replace( /[\w-]+/gi, '$&_acid' );
	case 'Atherosclerosis':
		text = text.replace( /(?:440.1 )*Atherosclerosis/i, '' );
		return text.replace( /[\w-]+/gi, '$&_as' );
	case 'Atrial Fibrillation':
		text = text.replace( /(?:427.31 )*Atrial Fibrillation/i, '' );
		return text.replace( /[\w-]+/gi, '$&_afib' );
	case 'Hypertension':
		text = text.replace( /(?:401.9 )*Hypertension/i, '' );
		return text.replace( /[\w-]+/gi, '$&_htn' );
	case 'Acute Kidney Failure':
	case 'Renal Failure Acute':
		text = text.replace( /(?:584.9 )*Acute Kidney Failure/i, '' );
		return text.replace( /[\w-]+/gi, '$&_arf' );
	case 'Chronic Kidney Disease[,:]{0,1} Stage (?:II|2)[^I]':
		text = text.replace( /(?:585\.2 )*Chronic Kidney Disease[,:]{0,1} Stage (?:II|2)[^I]/i, '' );
		return text.replace( /[\w-]+/gi, '$&_ckd2' );
	case 'Chronic Kidney Disease[,:]{0,1} Stage (?:III|3)':
		text = text.replace( /(?:585\.3 )*Chronic Kidney Disease[,:]{0,1} Stage (?:III|3)/i, '' );
		return text.replace( /[\w-]+/gi, '$&_ckd3' );
	case 'Chronic Kidney Disease[,:]{0,1} Stage[(?:IV)4':
		text = text.replace( /(?:585.4 )*Chronic Kidney Disease[,:]{0,1} Stage (?:IV|4)/i, '' );
		return text.replace( /[\w-]+/gi, '$&_ckd4' );
	case 'Chronic Kidney Disease,{0,1} Stage [V5]':
	case 'End Stage Renal Disease':
		text = text.replace( /(?:585.[56])*(?:Chronic Kidney Disease[,:]{0,1} Stage [V5]|End Stage Renal Disease)/i, '' );
		return text.replace( /[\w-]+/gi, '$&_ckd5' );
	case 'Cyst Kidney Acquired':
		text = text.replace( /(?:593.2 )*Cyst Kidney Acquired/i, '' );
		return text.replace( /[\w-]+/gi, '$&_cyst' );
	case 'Proteinuria':
		text = text.replace( /(?:791.0 )*Proteinuria/i, '' );
		return text.replace( /[\w-]+/gi, '$&_pru' );
	case 'Acquired Absence Of Kidney':
	case 'Nephrectomy':
		text = text.replace( /(?:V45.73 )*(?:Acquired Absence Of Kidney|Nephrectomy)/i, '' );
		return text.replace( /[\w-]+/gi, '$&_aak' );
	case 'Secondary Hyperparathyroidism':
		text = text.replace( /Secondary Hyperparathyroidism/i, '' );
		return text.replace( /[\w-]+/gi, '$&_shpt' );
	case 'Hypothyroidism':
		text = text.replace( /Hypothyroidism/i, '' );
		return text.replace( /[\w-]+/gi, '$&_hth' );
	case 'Vitamin D Deficiency':
		text = text.replace( /(?:268.9 )*Vitamin D Deficiency/i, '' );
		return text.replace( /[\w-]+/gi, '$&_df' );
	case 'Iron Deficiency':
		text = text.replace( /(?:280.9 )*Iron Deficiency/i, '' );
		return text.replace( /[\w-]+/gi, '$&_df' );
	case 'Edema':
		text = text.replace( /(?:782.3 )*Edema/i, '' );
		return text.replace( /[\w-]+/gi, '$&_edem' );
	case 'Paraproteinemia Monoclonal':
		text = text.replace( /(?:273.1 )*Paraproteinemia Monoclonal/i, '' );
		return text.replace( /[\w-]+/gi, '$&_pmo' );
	case 'Obesity':
		text = text.replace( /(?:278.00* )*Obesity/i, '' );
		return text.replace( /[\w-]+/gi, '$&_obes' );
	default:
		return text.replace( /[\w-]+/gi, '$&_gen' );
	}
}
