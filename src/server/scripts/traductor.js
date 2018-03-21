//const gtaLangs = require('../../client/lib/languages');
const gtaLangs = {  
  'ar': 'Arabic', 
  'eu': 'Basque',  
  'ca': 'Catalan',  
  'zh-cn': 'Chinese Simplified',  
  'en': 'English',
  'eo': 'Esperanto',  
  'gl': 'Galician',  
  'ja': 'Japanese',  
  'la': 'Latin',  
  'es': 'Spanish' 
};
const translate = require('google-translate-api');
const fs = require('fs');
//const gtaLangs = require('./src/client/lib/');

const englishLang = require('../../client/lib/i18n/englishNative.json');

Object.keys(gtaLangs).forEach((keyGTA) => {
  let fileJSON = {};  
  console.log('Translating to ' + keyGTA);
  
  Object.keys(englishLang).forEach((key) => {
    
    translate(englishLang[key], {to: keyGTA}).then(res => {
      fileJSON[key] = res.text;
      
      fs.writeFile('src/client/lib/i18n/' + gtaLangs[keyGTA] + '.json', JSON.stringify(fileJSON), 'utf8', (err) => {
        if (err) {
          throw err;
        }
        console.log('The file src/client/lib/i18n/' + gtaLangs[keyGTA] + '.json has been saved!');
        
      });
    }).catch(err => {
      console.error(err);
    });
    
  });
});

