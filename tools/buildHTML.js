// This script copies src/index.html into /dist/index.html
// This is a good example of using Node and cheerio to do a simple file transformation.
// In this case, the transformation is useful since we only use a separate css file in prod.
import fs from 'fs';
import cheerio from 'cheerio';
import colors from 'colors';
import ncp from 'ncp';

//var mkdirp = require('mkdirp');
//let assets = require('../thirdparty.config.json');
//console.log("Assets" + JSON.stringify(assets));
/*eslint-disable no-console */

/*mkdirp('dist/lib' , function (err) {
  if (err) console.error(err)
  else console.log('dir dist/lib created')
});*/

/*mkdirp('dist/css' , function (err) {
  if (err) console.error(err)
  else console.log('dir dist/css created')
});*/

/*for (let value of assets) {
  
  let dst = '';
  switch (value.type) {
    case 'js':
      dst = './dist/lib/'+value.file;            
      break;
    case 'css':
      dst = './dist/css/'+value.file;      
      break;
    case 'font':
      dst = './dist/fonts'+value.file;
      break;
    default:
      break;
  }
    
  ncp(value.base_path+value.file,dst, function (err) {
    if (err) {
      return console.error(err);
    }
    //console.log('done!');
  });

}*/

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
  //$('head').prepend('<link rel="stylesheet" href="styles.css">');

  /*for (let value of assets) {
    if (value.type==='css'){
      $('head').prepend('<link rel="stylesheet" href="css/'+ value.file +'">');
    }else if (value.type === 'js'){
      $('head').prepend('<script src="lib/' + value.file +'"></script>');      
    }
  }*/

  fs.writeFile('dist/index.html', $.html(), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('index.html written to /dist'.green);
  });
});