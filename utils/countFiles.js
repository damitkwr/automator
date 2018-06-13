var fs = require( 'fs' ),
  mean = require( 'compute-mean' ),
  median = require( 'compute-median' );

var dirs = fs.readdirSync( './../_Patients_Finished' );

var counts = [];
for ( var i = 0; i <  dirs.length; i++ ) {
  var dir = './../_Patients_Finished/' + dirs[ i ];
  var count = fs.readdirSync( dir ).length;
  counts.push( count / 3 );
}

console.log( mean( counts ) );
console.log( median( counts ) );
