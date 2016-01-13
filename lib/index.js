const ebArgs = require('commander');
const ebLib = require('elastic-beanstalk.js');
const gitRev = require('git-rev');

gitRev.tag(function(tagStr) {
  console.log(tagStr);
})
