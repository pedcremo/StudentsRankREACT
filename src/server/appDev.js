import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../../webpack.config.dev';
import open from 'open';

/* eslint-disable no-console */

var four0four = require('./utils/404')();
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

//NEW PERE
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false}
}));
var passport = require('passport');
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
//END NEW

app.use('/api', require('./routes'));

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

/*app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../client/index.html'));
});*/

app.use(express.static('./src/client'));
app.use(express.static('./'));
// Any invalid calls for templateUrls are under app/* and should return 404
app.use('/app/*', function(req, res, next) {
  four0four.send404(req, res);
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
    open(`http://localhost:${port}`);
  }
});