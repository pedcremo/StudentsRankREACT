import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin()
    //new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      //{test : /\.jsx?/,include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /(\.css)$/, loader: ExtractTextPlugin.extract("css?sourceMap")},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      //{test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,loader: "url?limit=100000&name=[name].[ext]"},
      //{test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,loader: "url-loader?limit=100000"},
      //{test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/, loader: "url?limit=100000&name=[name].[ext]"},
      {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=10000"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  }
};
