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
  headerTitle: "Students Rank",
  headerSubtitle: "The harder you work, the luckier you get",
  menuOptionNewSubject: 'NEW SUBJECT',
  addStudentTitle: 'Add new Student',
  addStudentLblFirstName: 'First name',
  addStudentLblSurnames: 'Surnames',
  addStudentLblEmail: 'Email',
  addStudentLblProfileImage: 'Profile Image',
  addStudentInputSave: 'Save',
  addGradedTaskTitle: 'Add new Graded Task',
  addGradedTaskSubtitle: 'We understand as a graded task any test or practice that will be marked by teacher and should be reflected in the final mark',
  addGradedTaskLblName: 'Task name',
  addGradedTaskLblDescription: 'Task description',
  addGradedTaskLblTerm: 'Task term',
  addGradedTaskLblWeight: 'Task Weight',
  addGradedTaskInputSave: 'Save',
  settingsTitle: 'Settings',
  settingsLblXP: 'Weight XP',
  settingsLblGT: 'Weight GT',
  settingsLblCode: 'Your code',
  settingsLblDefaultTerm: 'Default term',
  settingsLblChangeSubject: 'Change subject',
  settingsLblPreferredLanguage: 'Preferred language',
  menuTitleAddStudent: 'Add student',
  menuTitleAddGradedTask: 'Add graded task',
  menuTitleSettings: 'Settings',
  menuTitleLogout: 'Logout',
};


Object.keys(gtaLangs).forEach((keyGTA) => {
  let fileJSON = {};  
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + keyGTA);
  
  Object.keys(englishLang).forEach((key) => {
    
    translate(englishLang[key], {to: keyGTA}).then(res => {
      fileJSON[key] = res.text;
      
      fs.writeFile('src/client/lib/i18n/other/' + gtaLangs[keyGTA] + '.js', 'export default ' + JSON.stringify(fileJSON), 'utf8', (err) => {
        if (err) {
          throw err;
        }
        console.log('The file src/client/lib/i18n/' + gtaLangs[keyGTA] + '.js has been saved!');
        
      });
    }).catch(err => {
      console.error(err);
    });
    
  });
});


