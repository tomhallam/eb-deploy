'use strict';

var ebArgs = require('commander');
var ElasticBeanstalk = require('elastic-beanstalk.js');

var utils = require('./utils');

var ebDeploy = require('root-require')('./package.json');
var version = ebDeploy.version;

var path = require('path');

// Set up command line args
ebArgs.version(version).option('-a, --accessKeyId <key>', 'Set AWS Access Key').option('-s, --secretAccessKey <key>', 'Set AWS Secret Access Key').option('-r, --region <region>', 'Set AWS Region [eu-west-1]', 'eu-west-1').option('-A, --applicationName <name>', 'The name of your Elastic Beanstalk Application').option('-e, --environment <name>', 'Which environment should this application be deployed to?').option('-b, --bucketName <name>', 'The name of the *existing* S3 bucket to store your version').option('-B, --branch <name>', 'The branch that should be used to generate the archive [master]', 'master').option('-V, --packageVersionOrigin <version>', 'Whether to use the version from package.json, or git tag [package.json]', 'package.json').parse(process.argv);

// Check arguments
// Back out if we've not set the required keys
if (!ebArgs.accessKeyId) {
  console.error('AWS Access Key must be set!');
  process.exit(1);
}

if (!ebArgs.secretAccessKey) {
  console.error('AWS Secret Access Key must be set!');
  process.exit(1);
}

if (!ebArgs.applicationName) {
  console.error('Application name must be set!');
  process.exit(1);
}

if (!ebArgs.environment) {
  console.error('EB Environment must be set!');
  process.exit(1);
}

if (!ebArgs.bucketName) {
  console.error('EB Bucket Name must be set!');
  process.exit(1);
}

// All projects require a package.json
try {
  console.log('Attempting to load package.json: %s', path.join(process.cwd(), 'package.json'));
  var _packageInfo = require(path.join(process.cwd(), 'package.json'));
} catch (e) {
  console.error('No package.json found, exiting');
  console.error(e);
  process.exit(1);
}

var project = {
  name: ebArgs.applicationName || packageInfo.name || 'my-app'
};

// Create the Elastic Beanstalk client
var elasticBeanstalk = new ElasticBeanstalk({
  aws: {
    accessKeyId: ebArgs.accessKeyId,
    secretAccessKey: ebArgs.secretAccessKey,
    region: ebArgs.region || 'eu-west-1',
    applicationName: ebArgs.applicationName || 'my-app',
    versionsBucket: ebArgs.bucketName || 'mubaloo-ecs-config'
  }
});

// Create the archive
utils.makeVersionsFolder().then(function () {
  return utils.getGitTag();
}).then(function (tag) {
  project.version = ebArgs.packageVersionOrigin == 'package.json' ? packageInfo.version : tag;
  console.log('Project version @' + project.version);
  return utils.createArchive(ebArgs.branch, tag);
}).then(function () {
  return elasticBeanstalk.createVersionAndDeploy({
    environment: ebArgs.environment,
    filename: './.versions/' + project.version + '.zip',
    remoteFilename: project.name + '_' + project.version + '.zip',
    versionLabel: project.version
  });
}).then(function () {
  console.log('Successfully deployed ' + project.name + ' (' + project.version + ') to EB');
}).fail(function (error) {
  console.error(error);
  process.exit(1);
});
//# sourceMappingURL=index.js.map
