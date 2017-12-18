module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine-ajax','jasmine','browserify'],
      reporters: ['spec'],
      //browsers: ['ChromeHeadlessRANK'],
      browsers: ['Chrome'],
     
      customLaunchers: {
        ChromeHeadlessRANK: {
          base: 'Chrome',
          flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222']
        }
      },
      // Which plugins to enable
      plugins: [
        'karma-chrome-launcher',
        'karma-spec-reporter',
        'karma-browserify',
        'karma-jasmine',
        'karma-jasmine-ajax'
      ],
      files: [
        'lib/jquery/jquery.min.js',
        'src/client/**/*.js',
        'tests/**/*.js'
      ],

      singleRun:false,

      exclude: [
      ],

      preprocessors: {
        'src/**/*.js': ['browserify'],
        'tests/**/*.js': ['browserify']
      },
      browserify:{
        debug: true,
        transform: [['babelify', {presets: ['env']}]]
      }
    });
  };
