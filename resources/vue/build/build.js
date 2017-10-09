require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var inquirer = require('inquirer')

const buildRun = () => {
  var webpackConfig = require('./webpack.prod.conf')
  
  var spinner = ora('building for production...')
  spinner.start()

  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
  
      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }
  
      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
}

inquirer.prompt([{
  type: 'list',
  name: 'env',
  message: '请选择打包使用环境',
  choices: ['QATest', 'OnlineProduct'],
  validate: function (envSelected) {
    if (envSelected.length < 1) {
      return '未选择任何环境';
    }
    return true;
  }
}]).then((envSelected) => {
  // console.log(envSelected.env);
  if (envSelected.env === 'QATest') {
    process.env.beta = 'beta';
  }

  buildRun('.');
});
