var crypto = require('crypto');
var fs = require('fs');
var exec = require('child_process').exec;

var bundleFileName = './dist/boilerplate.js';
console.log('checking build')

var getShaOfBundle = function () {
    var distFile = fs.readFileSync(bundleFileName);
    var sha = crypto.createHash('sha1').update(distFile).digest("hex");
    return sha;
}
// make sure we only bundle/build what is staged to get a proper
// view of what will be committed
exec('git stash --keep-index');

// Get a snapshot of the original bundle
var beforeSha = getShaOfBundle();
console.log('beforeSha',beforeSha)

// run our build
exec('npm run build');

// snapshot the bundle after the build
var afterSha = getShaOfBundle();
console.log('afterSha',afterSha)

// reset anything that was stashed
exec('git stash pop');

if (beforeSha !== afterSha) {
    throw new Error("Need to bundle before committing. Don't worry about it I just built it for you. Add the extra files in /dist/ and commit again");
}