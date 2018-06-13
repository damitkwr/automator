var fs = require( 'fs' );
var diagDates = require( './diagnosisDate.json' );
var N = diagDates["Acct."].length;

var hash = {};
for ( var i = 0; i < N; i++ ) {
    var acct = diagDates["Acct."][i];
    hash[ acct ] =  diagDates["DiagDate"][i];
}


fs.writeFileSync( 'diagnosisHash.json', JSON.stringify( hash ) );
