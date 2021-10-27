const fs = require('fs');
const archiver = require('archiver');

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const output = fs.createWriteStream(process.env.PWD + '/boilerplate.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', () => {
  console.log(`${archive.pointer()} total bytes`);
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// good practice to catch this error explicitly
archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// append a file from stream
const file1 = `${process.env.PWD}/js/main.js`;
archive.append(fs.createReadStream(file1), { name: '/js/main.js' });

const file2 = `${process.env.PWD}/css/styles.css`;
archive.append(fs.createReadStream(file2), { name: '/css/styles.css' });

// const file3 = `${process.env.PWD}/index.html.mst`;
// archive.append(fs.createReadStream(file3), { name: 'index.html.mst' });

const file4 = `${process.env.PWD}/index.html`;
archive.append(fs.createReadStream(file4), { name: "index.html" });
archive.finalize();
