const translate = require('google-translate-api');

translate("I'm speaking english", {to: 'fr'}).then(res => {
    console.log(res.text);
    //=> I speak English 
    console.log(res.from.language.iso);
    //=> nl 
  }).catch(err => {
    console.error(err);
});