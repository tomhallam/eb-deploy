# eb-deploy
Deploy websites to Elastic Beanstalk from the command line.

## Installation

    npm install -g eb-deploy

## Usage
`eb-deploy` will deploy the project in the current working directory to Elastic Beanstalk.

This tool is exposed as a command line program. See the information below for an explanation:

    Usage: eb-deploy [options]

    Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -a, --accessKeyId <key>       Set AWS Access Key
    -s, --secretAccessKey <key>   Set AWS Secret Access Key
    -r, --region <region>         Set AWS Region [eu-west-1]
    -A, --applicationName <name>  The name of your Elastic Beanstalk Application
    -e, --environment <name>      Which environment should this application be deployed to?
    -b, --bucketName <name>       The name of the *existing* S3 bucket to store your version
    -B, --branch <name>           The branch that should be used to generate the archive [master]

## Examples
Deploy to an Elastic Beanstalk Instance

    eb-deploy \
      --accessKeyId=<access-key> \
      --secretAccessKey=<secret-access-key> \
      --region=eu-west-1 \
      --applicationName=My Application \
      --environment=my-application-dev \
      --bucketName=archiveStorage \
      --branch=master \
      /
