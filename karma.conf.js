process.env.NODE_ENV = 'development';
var webpack = require('webpack');

module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine-jquery','jasmine-ajax','jasmine'],
      reporters: ['spec'],
      browsers: ['Chrome'],

      customLaunchers: {
        ChromeHeadlessRANK: {
          base: 'Chrome',
          flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222']
        }
      },
      // Which plugins to enable
      plugins: [
        'karma-webpack',
        'karma-babel-preprocessor',
        'karma-chrome-launcher',
        'karma-spec-reporter',        
        'karma-jasmine',
        'karma-jasmine-jquery',
        'karma-jasmine-ajax'
      ],
      files: [
        'src/client/main.js',
        'tests/**/*.js'
      ],

      singleRun:false,

      exclude: [
      ],

      preprocessors: {        
        'src/**/*.js': ['webpack'],
        'tests/**/*.js': ['webpack']
      },
      webpack: {
        mode: 'development',        
        target: 'web',
        plugins: [
          new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            Popper: ['popper.js', 'default']
          }),
          //new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin()
          //new webpack.NoErrorsPlugin()
        ],

        module: {
            rules: [        
              {test: /\.js$/, exclude: /node_modules/, 
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['react-hmre','react']
                  }                
                }
              },                    
              {test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
              { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
              { test: /\.(eot|ttf|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: "file-loader" }
            ]
        },
        watch: true
      },
      webpackServer: {
          noInfo: true
      }
      
    });
  };
