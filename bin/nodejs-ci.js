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
    fs = require('fs'),
    clc = require('cli-color'),
    path = require('path');

var createProject = function () {
    process.stdout.write(clc.cyanBright('Fetching the grunt template for bootstrapping Node project...\n'));
    shell.exec('git clone https://github.com/zhzhang2012/nodejs-ci.git ~/.grunt-init/nodeci');
    process.stdout.write('\n');

    process.stdout.write(clc.cyanBright('Installing necessary grunt dependencies...\n'));
    shell.exec('npm install -g grunt && npm install -g grunt-init');
    process.stdout.write('\n');

    process.stdout.write(clc.cyanBright('Starting bootstrapping Node project...\n'));
    var child = exec('grunt-init nodeci', function (error, stdout, stderr) {
        console.log(stdout);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    // CLI read and write event listeners
    child.stdout.on('data', function (data) {
        process.stdout.write(data);
    });
    child.stdout.on('end', function () {
        child.stdin.write('\n');
        process.exit(1);
    });
    // Read stdin and send to child process
    process.stdin.on('readable', function () {
        var chunk = process.stdin.read();
        if (chunk !== null) {
            child.stdin.write(chunk);
        }
    });
};

var configGit = function () {

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
    .option('create, --create', 'Initiate a skeleton project', createProject)
    .option('git, --git', 'Configure GitHub repository', configGit)
    .option('integrate, --integrate', 'Add continuous integration support', configCI)
    .option('docker, --docker', 'Add docker integration', configDocker)
    .option('deploy, --deploy', 'Deploy to cloud container', deploy)
    .parse(process.argv);
