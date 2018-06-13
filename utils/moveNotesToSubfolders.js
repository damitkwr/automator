var fs = require( 'fs-extra' );
var glob = require( 'glob' );
var path = require( 'path' );


var workingDir = path.resolve( __dirname + '/../../_Patients' );

glob( workingDir + '/*.pdf', function( err, files ) {
  files.forEach( filePath => {
    var file = path.basename( filePath );
    var dir = file.split( '-' )[0];
    var fullDirName = path.join( workingDir, dir );
    fs.move( filePath, path.join( fullDirName, file ), function (err) {
        if (err) return console.error(err)
        console.log("success!")
    });
  });
});
