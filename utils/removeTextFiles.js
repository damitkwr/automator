var fs = require( 'fs' );
var glob = require( 'glob' );
var path = require( 'path' );


 fs.readdir( './../../_Patients_Finished', function(err, dirs) {
 dirs.forEach( dir => {
   var currentDir = path.resolve( __dirname + '/../../_Patients_Finished/' + dir );
   glob( currentDir + '/*.txt', function(err, files){
     files.forEach( file => {
       fs.unlinkSync(file);
     });
   });
 })

});
