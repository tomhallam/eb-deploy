'use strict';

const fs = require('fs');
const Q = require('q');
const gitRev = require('git-rev');
const exec = require('child_process').exec;
const path = require('path');

function makeVersionsFolder() {
  let deferred = Q.defer();

  fs.lstat(path.join(process.cwd(), '.versions'), function(err, stats) {
      if (!err && stats.isDirectory()) {
          return deferred.resolve();
      }
      else {
        fs.mkdir(path.join(process.cwd(), '.versions'), function(err) {
          if(err) {
            return deferred.reject(err);
          }
          return deferred.resolve();
        });
      }
  });

  return deferred.promise;

}

function getGitTag() {

  let deferred = Q.defer();

  gitRev.tag(function(tagStr) {
    deferred.resolve(tagStr);
  });

  return deferred.promise;

}

function createArchive(branch, version) {

  let deferred = Q.defer();

  const child = exec('git archive -o ' + path.join(process.cwd(), '.versions', version + '.zip') + ' ' + branch, function(err, stdout, stderr) {
    if (err) {
      return deferred.reject(err);
    }
    return deferred.resolve();
  });

  return deferred.promise;

};

exports.getGitTag = getGitTag;
exports.createArchive = createArchive;
exports.makeVersionsFolder = makeVersionsFolder;
