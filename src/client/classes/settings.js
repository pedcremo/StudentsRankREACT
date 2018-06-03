import {events} from '../lib/eventsPubSubs.js';
import Person from './person.js';
import {setCookie,getCookie} from '../lib/utils.js';

let settings = {};

events.subscribe('dataservice/getSettings',(obj) => {
  let settings_ = JSON.parse(obj);
  settings = new Settings(settings_.weightXP,settings_.weightGP,settings_.defaultTerm,settings_.terms,settings_.language,settings_.shareGroup);
  events.publish('settings/change',settings);
});

events.subscribe('settings/change',(obj) => {
  settings = obj;
  try{
    settings.defaultTermName = settings.defaultTerm=='ALL'?'ALL':settings.terms.filter((element) => {
      return element.id == settings.defaultTerm 
   })[0].name;
  }catch(error){
    settings.defaultTerm=1;
    settings.defaultTermName='1st';
  }
   events.publish('students/change',Person.getStudentsFromMap());
});

/**
 * Settings class. Create a settings file.
 * 
 * @constructor
 * @param {number} weightXP - weight XP points %
 * @param {number} weightGP - weight Graded Tasks %
 * @param {number} weight - task 
 * @param {string} defaultTerm 
 * @param {array} terms - List of terms
 * @tutorial pointing-criteria
 */


class Settings {
  constructor(weightXP,weightGP,defaultTerm,terms,language,shareGroup) {
    this.weightXP = weightXP;
    this.weightGP = weightGP;
    this.terms = terms;
    this.defaultTerm = this.getDefaultTerm(defaultTerm);
    
    try {
      this.defaultTermName = this.defaultTerm=='ALL'?'ALL':this.terms.filter((element) => {
      return element.id == this.defaultTerm 
      })[0].name;
    }catch(error) {
      this.defaultTerm=1;
      this.defaultTermName='1st';
    }
    this.language = language;

    this.shareGroup = shareGroup;
  }
  getDefaultTerm(defaultTerm) {
    if (defaultTerm) {
      this.defaultTerm = defaultTerm;
      return this.defaultTerm;
    }else {
      let out = '';
      try {
        out = this.terms[0].name;
        this.terms.forEach(element => {
          let dateFrom = element.begin;
          let dateTo = element.end;
          let d1 = dateFrom.split('/');
          let d2 = dateTo.split('/');

          let from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
          let to   = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
          let currentDate = new Date();
          if (currentDate > from && currentDate < to) {
            out = element.id;
          }
        });
      }catch (err) {
        out = 1;
      }
      this.defaultTerm = out;
      return out;
    }
  }

  static getLanguage() {  
    if (settings.language == undefined) {
      settings.language = getCookie("language") || "English";      
    } 
    
    setCookie("language",settings.language,350);
    return settings.language;
  }
  
  /*static getTermIdFromDateRange(begin,end) {
    let foundTerm = settings.terms.find(function(element) { return element.name == settings.defaultTerm });
      let targetBegin = new Date(begin).getTime();
      let targetBegin = new Date(begin).getTime();
      let begin = new Date(foundTerm.begin).getTime();
      let end = new Date(foundTerm.end).getTime();
      if (target>=begin && target <=end) {
        return true;
      }else {
        return false;
      }
  }*/
  /*static isDateInDefaultTermDateRange(dateTimeString) {
    if (settings.defaultTerm === "ALL") {
      return true;
    }else {
      let foundTerm = settings.terms.find(function(element) { return element.name == settings.defaultTerm });
      let target = new Date(dateTimeString).getTime();
      let begin = new Date(foundTerm.begin).getTime();
      let end = new Date(foundTerm.end).getTime();
      if (target>=begin && target <=end) {
        return true;
      }else {
        return false;
      }
    }
  }*/

  static getSettings() {
    return settings;
  }
  
  //Return id of defaultTerm
  static getDefaultTerm() {
    return settings.defaultTerm;
  }
  
  static getXpWeight(){
    return settings.weightXP;
  }

  static getGtWeight(){
    return settings.weightGP;
  }
  static getsettings(){
    return settings;
  }  
}

export default Settings;
