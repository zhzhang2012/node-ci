/**
 * nodejs-ci
 * Node Scaffold with Continuous Integration and hosting
 *
 * Created by Tony Zhang
 */

'use strict';

// A short description about this tool
exports.description = "Initiates A Node.js scaffold that allows fast testing, deploying and hosting";

// Info messages displayed before the prompts
exports.notes = "_Project name_ should be a unique ID that is not already on npmjs.org";

// Info messages displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
    'install_. After that, you may execute project tasks with either _nodemon_ or _gulp_. \n\n' +
    'For more information about using Gulp, please see http://gulpjs.com/ \n\n' +
    'For more information about using _nodemon_, please see http://nodemon.io/';

// Files matching this sequences will be warned
exports.warnOn = '*.{js, html, yml}';
exports.warnOn = 'Dockerfile';

// Project configurations starting here
exports.template = function (grunt, init, done) {
    //grunt.file.mkdir(path.join(init.destpath(), 'app-dev'));
    //grunt.file.copy(path.join(init.userDir(), 'root', 'app-dev', 'index.html'));
    //grunt.file.copy(path.join(init.userDir(), 'root', 'app-dev', 'server.js'));
    //grunt.file.mkdir(path.join(init.destpath(), 'root', 'app-prod'));
    //grunt.file.mkdir(path.join(init.destpath(), 'root', 'app-test'));

    init.process({type: 'node'}, [
        // Prompt for these values.
        init.prompt('name'),
        init.prompt('description'),
        init.prompt('version', '1.0.0'),
        init.prompt('repository'),
        init.prompt('homepage', 'index.html'),
        init.prompt('bugs'),
        init.prompt('licenses', 'MIT'),
        init.prompt('author'),
        init.prompt('node_version', '>= 0.8.0'),
        init.prompt('main')
    ], function (err, props) {
        if (err)
            console.log(err);

        props.keyword = [];

        // Inject dependencies into the project
        props.dependencies = {
            "body-parser": "1.12.3",
            "express": "4.12.3"
        };
        props.devDependencies = {
            "gulp": "^3.9.0",
            "gulp-concat": "^2.6.0",
            "gulp-jshint": "^1.11.2",
            "gulp-rename": "^1.2.2",
            "gulp-sass": "^2.0.4",
            "gulp-uglify": "^1.2.0"
        };

        // Initialize files to copy
        // Note that all files are registered in rename.json
        var files = init.filesToCopy(props);

        // Copy and bootstrap necessary files
        init.copyAndProcess(files, props);
        init.addLicenseFiles(files, props.licenses);

        // Now bootstrap the package.json
        init.writePackageJSON('package.json', props);

        // All finished!
        done();
    })
};