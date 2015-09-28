#! /usr/bin/env node

/**
 * Created by Tony_Zhang on 9/21/15.
 */

/**
 * Module dependencies
 */
var program = require('commander'),
    shell = require('shelljs'),
    child_process = require('child_process'),
    exec = child_process.exec,
    prompt = require('prompt'),
    fs = require('fs'),
    Promise = require('es6-promise').Promise,
    clc = require('cli-color'),
    path = require('path');

var createProject = function () {
    var templatePromise = new Promise(function (resolve, reject) {
        process.stdout.write(clc.cyanBright('Fetching the grunt template for bootstrapping Node project...\n'));
        shell.exec('git clone https://github.com/zhzhang2012/nodejs-ci.git ~/.grunt-init/nodeci',
            function (code) {
                var TEMPLATE_EXIST_CODE = 128;
                if (code != 0 && code != TEMPLATE_EXIST_CODE) {
                    reject(code);
                } else {
                    process.stdout.write('\n');
                    resolve();
                }
            });
    });

    var gruntPromise = new Promise(function (resolve, reject) {
        process.stdout.write(clc.cyanBright('Installing necessary grunt dependencies...\n'));
        shell.exec('npm install -g grunt && npm install -g grunt-init', function (code, output) {
            if (code !== 0) {
                process.stdout.write(clc.red("Error installing global dependencies: " + output + '\n'));
                process.stdout.write(clc.red("Please try again with sudo: [sudo nodeci create[ \n"));
                reject(code);
            } else {
                process.stdout.write('\n');
                resolve();
            }

        });
    });

    // Show the prompt window after finish installing dependencies
    Promise.all([templatePromise, gruntPromise])
        .then(function () {
            process.stdout.write(clc.cyanBright('Starting bootstrapping Node project...\n'));
            var child = exec('grunt-init nodeci', function (error, stdout, stderr) {
                process.stdout.write(stdout);
                if (error !== null) {
                    process.stdout.write(clc.red('exec error: ' + error));
                }
            });

            // CLI read and write event listeners
            child.stdout.on('data', function (data) {
                process.stdout.write(data);
            });
            child.stdout.on('end', function () {
                child.stdin.write('\n');
                process.exit(0);
            });
            // Read stdin and send to child process
            process.stdin.on('readable', function () {
                var chunk = process.stdin.read();
                if (chunk !== null) {
                    child.stdin.write(chunk);
                }
            });
        }).catch(function (code) {
            process.stdout.write(clc.red("Error occurred while installing dependencies: " + code));
            process.exit(1);
        });
};

var configGit = function () {
    process.stdout.write(clc.cyanBright('Start configuring GitHub and necessary branches...\n'));

    prompt.start();
    prompt.get([{
        name: 'origin',
        description: 'Please enter your origin git repository: ',
        type: 'string',
        required: true
    }, {
        name: 'upstream',
        description: 'Please enter your upstream master repository: ',
        type: 'string',
        required: false
    }], function (err, result) {
        if (err) {
            process.stdout.write(clc.red("Error occurred when initializing git remotes" + err));
            process.exit(1);
        }

        process.stdout.write(clc.cyanBright('Start configuring master (app-prod) branch...\n'));
        exec('cd app-prod && git init && git remote add origin ' + result.origin,
            function (error, stdout, stderr) {
                process.stdout.write(stdout);
                if (error !== null) {
                    process.stdout.write(clc.red('exec error: ' + error));
                }
            });

        if (typeof result.upstream !== 'undefined') {
            exec('cd app-prod && git remote add upstream ' + result.origin,
                function (error, stdout, stderr) {
                    process.stdout.write(stdout);
                    if (error !== null) {
                        process.stdout.write(clc.red('exec error: ' + error));
                    }
                });
        }

        process.stdout.write(clc.cyanBright('Start configuring development (app-dev) branch...\n'));
        exec('cd app-dev && git init && git remote add origin ' + result.origin,
            function (error, stdout, stderr) {
                process.stdout.write(stdout);
                if (error !== null) {
                    process.stdout.write(clc.red('exec error: ' + error));
                }
            });

        if (typeof result.upstream !== 'undefined') {
            exec('cd app-dev && git remote add upstream ' + result.origin,
                function (error, stdout, stderr) {
                    process.stdout.write(stdout);
                    if (error !== null) {
                        process.stdout.write(clc.red('exec error: ' + error));
                    }
                });
        }

        // configuring branch
        exec('cd app-dev && git checkout -b dev master', function (error, stdout, stderr) {
            process.stdout.write(stdout);
            if (error !== null) {
                process.stdout.write(clc.red('exec error: ' + error));
            }
        });

        process.stdout.write(clc.cyanBright('Start configuring test (app-test) branch...\n'));
        exec('cd app-test && git init && git remote add origin ' + result.origin,
            function (error, stdout, stderr) {
                process.stdout.write(stdout);
                if (error !== null) {
                    process.stdout.write(clc.red('exec error: ' + error));
                }
            });

        if (typeof result.upstream !== 'undefined') {
            exec('cd app-test && git remote add upstream ' + result.origin,
                function (error, stdout, stderr) {
                    process.stdout.write(stdout);
                    if (error !== null) {
                        process.stdout.write(clc.red('exec error: ' + error));
                    }
                });
        }

        // configuring branch
        exec('cd app-test && git checkout -b test master', function (error, stdout, stderr) {
            process.stdout.write(stdout);
            if (error !== null) {
                process.stdout.write(clc.red('exec error: ' + error));
            }
        });
    });
};

var configCI = function () {

};

var configDocker = function () {

};

var deploy = function () {

};

program
    .version('1.0.0')
    .usage('[options]')
    .option('create, --create', 'Initiate a skeleton project. sudo recommended for this command', createProject)
    .option('git, --git', 'Configure GitHub repository', configGit)
    .option('integrate, --integrate', 'Add continuous integration support', configCI)
    .option('docker, --docker', 'Add docker integration', configDocker)
    .option('deploy, --deploy', 'Deploy to cloud container', deploy)
    .parse(process.argv);
