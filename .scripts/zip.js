const fs = require('fs');
const archiver = require('archiver');

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const builds = [
	{
		zip: "boilerplate.zip",
		html: "index.html",
		css: "css/styles.css",
		js: "js/main.js" 
	},
	{
		zip: "boilerplate-mst.zip",
		html: "index.html.mst",
		css: "css/styles.css",
		js: "js/main-legacy.js"
	}
];

builds.map(build => {
	const stream = fs.createWriteStream(`${process.env.PWD}/${build.zip}`);

	const archive = archiver('zip', {
		zlib: { level: 9 }, // Sets the compression level.
	});

	// listen for all archive data to be written
	// 'close' event is fired only when a file descriptor is involved
	stream.on('close', () => {
		console.log(`${archive.pointer()} total bytes`);
		console.log('archiver has been finalized and the output file descriptor has closed.');
	});

	// good practice to catch this error explicitly
	archive.on('error', (err) => {
		throw err;
	});

	archive.pipe(stream);
	
	archive.append(fs.createReadStream(`${process.env.PWD}/${build.html}`), { name: build.html });
	archive.append(fs.createReadStream(`${process.env.PWD}/${build.css}`), { name: build.css });
	// Ensure the outputted JS has the same name the html file is looking for
	archive.append(fs.createReadStream(`${process.env.PWD}/${build.js}`), { name: "js/main.js" });
	
	archive.finalize();
});
