'use strict';

var fs = require('fs');
var Q = require('q');
var gitRev = require('git-rev');
var exec = require('child_process').exec;
var path = require('path');

function makeVersionsFolder() {
  var deferred = Q.defer();

  fs.lstat(path.join(process.cwd(), '.versions'), function (err, stats) {
    if (!err && stats.isDirectory()) {
      return deferred.resolve();
    } else {
      fs.mkdir(path.join(process.cwd(), '.versions'), function (err) {
        if (err) {
          return deferred.reject(err);
        }
        return deferred.resolve();
      });
    }
  });

  return deferred.promise;
}

function getGitTag() {

  var deferred = Q.defer();

  gitRev.tag(function (tagStr) {
    deferred.resolve(tagStr);
  });

  return deferred.promise;
}

function createArchive(branch, version) {

  var deferred = Q.defer();
  console.log('Creating project archive @ %s from branch %s', path.join(process.cwd(), 'release.' + version + '.zip'), branch);

  var child = exec('git archive -o ' + path.join(process.cwd(), 'release.' + version + '.zip') + ' ' + branch, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      return deferred.reject(err);
    }
    console.log('Zip created');
    return deferred.resolve();
  });

  return deferred.promise;
};

exports.getGitTag = getGitTag;
exports.createArchive = createArchive;
exports.makeVersionsFolder = makeVersionsFolder;
//# sourceMappingURL=utils.js.map
