// Karma configuration
// Generated on Thu Nov 03 2016 11:57:48 GMT+0100 (Środkowoeuropejski czas stand.)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],


    // list of files / patterns to load in the browser
    // 1. add angularj.js directory
    // 2. add angular-mock
    // 3. add test files
    files: [
      /* angular files */
      './../node_modules/angular/angular.js',
      './../node_modules/angular-mocks/angular-mocks.js',
      './../node_modules/angular-aria/angular-aria.js',
      './../node_modules/angular-animate/angular-animate.js',
      './../node_modules/angular-messages/angular-messages.js',
      './../node_modules/angular-material/angular-material.js',
      './../node_modules/angular-material/angular-material-mocks.js',
      './../node_modules/angular-sanitize/angular-sanitize.js',
      /* MY APP */
      /* layout*/
      './../public/layout/layout.module.js',
      './../public/layout/sidenav.controller.js',

      './../public/app.module.js',
      './../public/app.config.js',
      './../public/app.run.js',
      /* test files */
      './../tests/**/*.js'
      /* backend files */
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './../tests/**/*.js': [ 'browserify' ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
