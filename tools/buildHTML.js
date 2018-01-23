// This script copies src/index.html into /dist/index.html
// This is a good example of using Node and cheerio to do a simple file transformation.
// In this case, the transformation is useful since we only use a separate css file in prod.
import fs from 'fs';
import cheerio from 'cheerio';
import colors from 'colors';
import ncp from 'ncp';
//import assets from '../thirdparty.config.js';

/*eslint-disable no-console */
let assets = [
  {type:'css',src:'node_modules/toastr/build/toastr.min.css'},
  {type:'js',src:'node_modules/toastr/build/toastr.min.js'},
  {type:'css',src:'node_modules/bootstrap/dist/css/bootstrap.min.css'},
  {type:'js',src:'node_modules/bootstrap/dist/js/bootstrap.min.js'},
  {type:'js',src:'node_modules/popper.js/dist/popper.min.js'},
  {type:'js',src:'node_modules/font-awesome/css/font-awesome.min.css'},
  {type:'font',src:'node_modules/font-awesome/fonts'},
  {type:'js',src:'node_modules/jquery/dist/jquery.min.js'}    
];

for (let value of assets) {
  console.log(value.type);
  console.log(value.src);
  let dst = '';
  switch (value.type) {
    case 'js':
      dst = './dist/lib/';            
      break;
    case 'css':
      dst = './dist/css/';      
      break;
    case 'font':
      dst = './dist/fonts';
      break;
    default:
      break;
  }
    
  ncp(value.src,dst, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('done!');
  });

}

ncp('./src/client/templates', './dist/templates', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('done!');
 });

fs.readFile('src/client/index.html', 'utf8', (err, markup) => {
  if (err) {
    return console.log(err);
  }

  const $ = cheerio.load(markup);

  // since a separate spreadsheet is only utilized for the production build, need to dynamically add this here.
  $('head').prepend('<link rel="stylesheet" href="styles.css">');

  fs.writeFile('dist/index.html', $.html(), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('index.html written to /dist'.green);
  });
});