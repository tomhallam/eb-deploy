const ebArgs = require('commander');
const ElasticBeanstalk = require('elastic-beanstalk.js');

const utils = require('./utils');

const ebDeploy = require('root-require')('./package.json');
const version = ebDeploy.version;
//const devCreds = require('root-require')('./creds.json');

// Set up command line args
ebArgs
  .version(version)
  .option('-a, --accessKeyId <key>', 'Set AWS Access Key')
  .option('-s, --secretAccessKey <key>', 'Set AWS Secret Access Key')
  .option('-r, --region', 'Set AWS Region [eu-west-1]', 'eu-west-1')
  .option('-A, --applicationName <name>', 'The name of your Elastic Beanstalk Application [my-app]', 'my-app')
  .option('-e, --environment <name>', 'Which environment should this application be deployed to? [environment]', 'my-environment')
  .option('-b, --bucketName <name>', 'The name of the *existing* S3 bucket to store your version [my-bucket]', 'my-bucket')
  .option('-p, --packageLocation', 'Location of package.json if not ./package.json')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

// Check arguments
/*
// Back out if we've not set the required keys
if(!ebArgs.accessKeyId) {
  console.error('AWS Access Key must be set!');
  process.exit(1);
}

if(!ebArgs.secretAccessKey) {
  console.error('AWS Secret Access Key must be set!');
  process.exit(1);
}
*/

// All projects require a package.json
try {
  const packageInfo = require('root-require')('./package.json');
}
catch(e) {
  console.error('No package.json found, exiting');
  console.error(e);
  process.exit(1);
}

const project = {
  name: (ebArgs.applicationName || packageInfo.name || 'my-app')
};

// Create the Elastic Beanstalk client
const elasticBeanstalk = new ElasticBeanstalk({
  aws: {
    accessKeyId: ebArgs.accessKeyId,
    secretAccessKey: ebArgs.secretAccessKey,
    region: ebArgs.region || 'eu-west-1',
    applicationName: ebArgs.applicationName || 'my-app',
    versionsBucket: ebArgs.bucketName || 'mubaloo-ecs-config'
  }
});

// Create the archive
utils.makeVersionsFolder()
  .then(function() {
    return utils.getGitTag()
  })
  .then(function(tag) {
    project.version = tag;
    return utils.createArchive('master', tag)
  })
  .then(function() {
    return elasticBeanstalk.createVersionAndDeploy({
      environment: ebArgs.environment,
      filename: './.versions/' + project.version + '.zip',
      remoteFilename: project.name + '_' + project.version + '.zip',
      versionLabel: project.version
    });
  })
  .then(function() {
    console.log('Successfully deployed ' + project.name + ' (' + project.version + ') to EB');
  })
  .fail(function(error) {
    console.error(error);
  })
