//load modules required
var clc = require('./colors'),
  shelljs = require('shelljs'),
  async = require('async'),
  path = require('path'),
  fs = require('fs'),
  spawn = require('child_process').spawn;
var currentStep = 1;
var app = {
  //git init
  initGit: function(callback) {
    console.log(clc.info(currentStep++ + '. init git'));
    try {
      shelljs.exec('git init', {
        async: false
      });
      console.log(clc.notice('git init successfully'));
      callback();
    } catch (err) {
      callback(new Error('failed to init git'));
    }
  },
  //npm init
  initNpm: function(callback) {
    console.log(clc.info(currentStep++ + '. start npm init'));
    var npm = process.platform === "win32" ? 'npm.cmd' : 'npm';
    var npmInit = spawn(npm, ['init'], {
      stdio: 'inherit'
    });
    npmInit.on('close', function(code) {
      if (code !== 0) {
        return callback(new Error('npm init failed'));
      }
      console.log(clc.notice('npm init successed.'));
      callback();
    });
  },
  //add default files to project
  addProjectDefaultFiles: function(callback) {
    console.log(clc.info(currentStep++ + '. add project default files'));
    try {
      var resourcesPath = '/../resources/' + app.options.path + '/';
      shelljs.cp('-rf', __dirname + resourcesPath + '\.*', './');
      shelljs.cp('-rf', __dirname + resourcesPath + '*', './');
      console.log(clc.notice('default files added'));
      callback();
    } catch (err) {
      callback(new Error('failed to add default files:\n' + err.message));
    }
  },
  //add project npm dependencies
  addNpmDependencies: function(callback) {
    console.log(clc.info(currentStep++ + '. add and install npm dependencies'));
    try {
      shelljs.exec('npm install', {
        async: false
      });
      console.log(clc.notice('project npm dependencies installed successfully'));
      callback();
    } catch (err) {
      callback(new Error('failed to install project npm dependencies'));
    }
  },
  //finished init
  initFinished: function(callback) {
    console.log(clc.info(currentStep++ + '. project init finished!'));
    console.log('***************************');
    console.log('*   Enjoy your ' + app.options.path + ' project!   *');
    console.log('***************************');
    callback();
  },
  
  //edit gitignore file
  updateGitignore: function(callback) {
    console.log(clc.info(currentStep++ + '. update .gitignore file'));
    try {
      var file = path.resolve(shelljs.pwd(), '.gitignore');
      //check .gitignore file
      fs.exists(file, function(exist) {
        if (!exist) {
          shelljs.exec('touch .gitignore', {
            async: false
          });
          console.log(clc.warn('.gitignore file not find in this project'));
          console.log(clc.notice('.gitignore file created'));
        }
        var fileContent = fs.readFileSync(file, {
          encoding: 'utf8'
        });
        var addContent = '# node files\nnode_modules/\nnpm-debug.log\nlogs/\n#build files\ndist/\n';
        
        fileContent = fileContent + addContent;
        fs.writeFileSync(file, fileContent);
        console.log(clc.notice('.gitignore file update successfully'));
        callback();
      });
    } catch (err) {
      callback(new Error('failed to update .gitignore file: \n' + err.message));
    }
  },
};

module.exports = {
  init: function(options) {
    app.options = options || {};

    var commonWaterFall = [
      app.initGit, //git init

      app.updateGitignore, //update .gitignore file
      
      app.addProjectDefaultFiles, //add default files to project
      
      // app.initNpm, //npm init
      
      // app.addNpmDependencies, //init project npm dependencies
      
      app.initFinished //init finished
    ];

    async.waterfall(commonWaterFall, function(err, rs) {
      if (err) {
        console.log(clc.error(err.message));
        return;
      }
    });
  }
};