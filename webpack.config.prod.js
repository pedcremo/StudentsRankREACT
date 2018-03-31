
import webpack from 'webpack';
import path from 'path';
//import ExtractTextPlugin from 'extract-text-webpack-plugin';

/*const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
  //'process.env.NODE_ENV': JSON.stringify('development')
};*/

export default {
  mode: 'production',
  //debug: true,
  devtool: 'source-map',
  //noInfo: false,
  entry: './src/client/main',
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    //new webpack.optimize.OccurenceOrderPlugin(),
    //new webpack.DefinePlugin(GLOBALS),
    //new ExtractTextPlugin('styles.css'),
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    rules: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
      {test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
      //{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      //{test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000"},
      //{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
      //{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"},
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(eot|ttf|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: "file-loader" }
    ]
  }
};
