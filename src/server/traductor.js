const translate = require('google-translate-api');
const fs = require('fs');
const gtaLangs = {
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ny': 'Chichewa',
  'zh-cn': 'Chinese Simplified',
  'zh-tw': 'Chinese Traditional',
  'co': 'Corsican',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'tl': 'Filipino',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Frisian',
  'gl': 'Galician',
  'ka': 'Georgian',
  'de': 'German',
  'el': 'Greek',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'iw': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ig': 'Igbo',
  'id': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'ja': 'Japanese',
  'jw': 'Javanese',
  'kn': 'Kannada',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'ko': 'Korean',
  'ku': 'Kurdish (Kurmanji)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'lb': 'Luxembourgish',
  'mk': 'Macedonian',
  'mg': 'Malagasy',
  'ms': 'Malay',
  'ml': 'Malayalam',
  'mt': 'Maltese',
  'mi': 'Maori',
  'mr': 'Marathi',
  'mn': 'Mongolian',
  'my': 'Myanmar (Burmese)',
  'ne': 'Nepali',
  'no': 'Norwegian',
  'ps': 'Pashto',
  'fa': 'Persian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'ma': 'Punjabi',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sm': 'Samoan',
  'gd': 'Scots Gaelic',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'sn': 'Shona',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'es': 'Spanish',
  'su': 'Sundanese',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'cy': 'Welsh',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zu': 'Zulu'
};
const englishLang = {
  "motto": "The harder you work, the luckier you get",
  "headerTitle": "Students Rank",
  "headerSubtitle": "The harder you work, the luckier you get",
  "menuOptionNewSubject": "NEW SUBJECT",
  "addStdentTitle": "Ad new Student",
  "addStudentLbFirstName": "First name",
  "addStudentLlSurname": "Surnames",
  "addStudetLblEail": "Email",
  "addStudentLblPrfileImage": "rofile Image",
  "addStudenInpuSave": "Save",
  "addGradeTaskTitle": "Add ne Graded Task",
  "addGradedTakSubtitle": "We understand as a graded task any test or practice that will be marked by teacher and should be reflected in te final mark",
  "addGradedTskLblName": "Task name",
  "addGradedTaskLblDscription": "Tas description",
  "addGradedTskLblTerm": "Task term",
  "addGradedTasLblWeight":"Task Weight",
  "addGradedTasInpuSave": "Save",
  "setingsTitl": "Settings",
  "setingsLblXP": "Weight XP",
  "setingsLblGT": "Weight GT",
  "settigsLblCode": "Your code",
  "settingsLblDfaultTerm": "Default term",
  "settingsLblChageSubject": "Change subject",
  "settingsLblPreferrdLanguage": "Prefered language",
  "menuTitleddStudent":"Add student",
  "menuTitleAddradedTask": "Ad graded task",
  "menuTiteSetting": "Settings",
  "menuTtleLogut": "Logout"
};


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



