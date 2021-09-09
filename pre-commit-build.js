const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');

const bundleFileName = './dist/boilerplate.js';
console.log('checking build');

const getShaOfBundle = function () {
  const distFile = fs.readFileSync(bundleFileName);
  const sha = crypto.createHash('sha1').update(distFile).digest('hex');
  return sha;
};
// make sure we only bundle/build what is staged to get a proper
// view of what will be committed
exec('git stash --keep-index');

// Get a snapshot of the original bundle
const beforeSha = getShaOfBundle();
console.log('beforeSha', beforeSha);

// run our build
exec('npm run build');

// snapshot the bundle after the build
const afterSha = getShaOfBundle();
console.log('afterSha', afterSha);

// reset anything that was stashed
exec('git stash pop');

if (beforeSha !== afterSha) {
  throw new Error("Need to bundle before committing. Don't worry about it I just built it for you. Add the extra files in /dist/ and commit again");
}
