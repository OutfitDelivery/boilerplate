var fs = require("fs");
const archiver = require('archiver');


const output = fs.createWriteStream(__dirname + '/boilerplate.zip');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

// good practice to catch this error explicitly
archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

// append a file from stream
const file1 = __dirname + '/js/main.js';
archive.append(fs.createReadStream(file1), { name: '/js/main.js' });

const file2 = __dirname + '/css/styles.less';
archive.append(fs.createReadStream(file2), { name: '/css/styles.less' });

const file3 = __dirname + '/index.html.mst';
archive.append(fs.createReadStream(file3), { name: 'index.html.mst' });


archive.finalize();
