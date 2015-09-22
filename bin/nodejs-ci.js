#! /usr/bin/env node

/**
 * Created by Tony_Zhang on 9/21/15.
 */

/**
 * Module dependencies
 */
var program = require('commander'),
    shell = require('shelljs'),
    fs = require('fs'),
    clc = require('cli-color'),
    path = require('path');

var createProject = function () {
    var cloneTemplateChild = shell.exec('git clone https://github.com/zhzhang2012/nodejs-ci.git ~/.grunt-init/nodeci');
    var child = shell.exec('npm install -g grunt-init && grunt-init nodeci/bootstrap', {async: true});
    child.stdout.on('data', function (data) {
        console.log(data);
        //if (code !== 0) {
        //    console.error(clc.red("Error occurred while installing essential dependencies"));
        //    console.log(clc.white("You may need administrator access. Try again with sudo [sudo nodeci create]."));
        //}
        //
        //console.log(output);
        process.exit(1);
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


