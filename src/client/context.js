/*
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';
import {updateFromServer,saveStudents,saveGradedTasks,saveSettings,saveSubjects} from './dataservice.js';
import {hashcode,loadTemplate,setCookie,deleteCookie,getCookie} from './lib/utils.js';
import {generateMenu,showMenu,hideMenu,addSubject} from './menu.js';
import {events} from './lib/eventsPubSubs.js';
import $ from "jquery";
import toastr from "toastr";
import Settings from './classes/settings.js';
import RankingListPage from './components/rankingListPage.js';
import LoginPage from './components/loginPage.js';
import React from 'react';
import reactDOM from 'react-dom';

class Context {

  constructor() {
    if (getCookie('user')) {
      this.user = JSON.parse(getCookie('user'));
    }
    events.subscribe('/context/addXP', (obj) => { 
      let typeToastr = 'success';
      if (obj.attitudeTask.points < 0) {typeToastr = 'error';};
      this.notify('Added ' +  obj.attitudeTask.points + ' ' + obj.attitudeTask.description + ' to ' + obj.person.name + ',' + obj.person.surname, obj.person.surname + ' ,' + obj.person.name,typeToastr);
    });
  
  }
  /** Clear context  */
  clear() {
    this.user = undefined;
  }

  deleteSubject(subject) {
    
    this.user.defaultSubject = 'default';
    for (let i=0;i<this.user.subjects.length;i++) {
        if (subject === this.user.subjects[i]) {
          if (i> -1) {
            this.user.subjects.splice(i, 1);
          }
        }else {
          this.user.defaultSubject = this.user.subjects[i];
        }
    }    
    let subjectsCopy = {'defaultSubject':this.user.defaultSubject,'subjects':this.user.subjects};
    saveSubjects(subjectsCopy, generateMenu);
  }

  editSubject(newname) {
    let oldsubject = this.user.defaultSubject;

    this.user.defaultSubject = newname;
    for (let i=0;i<this.user.subjects.length;i++) {
        if (oldsubject === this.user.subjects[i]) {
          if (i> -1) {
            this.user.subjects[i] = newname;
          }    
        }
    }
    let subjectsCopy = {'defaultSubject':this.user.defaultSubject,'subjects':this.user.subjects};
    console.log(subjectsCopy);
    saveSubjects(subjectsCopy,  
      loadTemplate('api/renameSubject',function(response) {            
        generateMenu(); 
      },'GET','newSubject=' + newname + '&oldSubject=' + oldsubject ,false)
    );
  }
  /* Check on server if user is logged */
  isLogged() {
    loadTemplate('api/loggedin',function(response) {      
      /* Not logged */
      if (response === '0') {
        this.clear();
        this.login();
        return false;
      /* Login and getting user credential */
      }else {
        this.user = JSON.parse(response);
        /* Only call server if we not have loaded students */ 
        if (this.user.defaultSubject === 'default') {         
          addSubject(updateFromServer);
        }else if (Person.getStudentsSize() <= 0) {
          updateFromServer();
        }else {
          this.getTemplateRanking();
        }
        return true;
      }
    }.bind(this),'GET','',false);
  }
  /** Show login form template when not authenticated */
  login() {
    let that = this;
    if (!this.user) {
      this.clear();
      reactDOM.render(<LoginPage props={Settings.getSettings()} />, document.getElementById('content'));
      $('#loginAlert').hide();
      hideMenu();
      events.subscribe('context/login',(credentials) => {
        loadTemplate('api/login',function(userData) {
          that.user = JSON.parse(userData);
          /* First time we log in */
          if (that.user.defaultSubject === 'default') {
            addSubject(updateFromServer);
          /* We are veteran/recurrent users */
          }else {
            setCookie('user',userData,7);
            updateFromServer();
          }  
        },'POST','username=' + credentials.username + '&password=' + credentials.password,false);  
      });
    }else {      
      that.getTemplateRanking(true);
    }
  }

  /** Draw Students ranking table in descendent order using total points as a criteria */
  getTemplateRanking(umount=false) {
    generateMenu();   
    Person.getRankingTable(umount);    
  }

  /** Add last action performed to lower information layer in main app */
  notify(text,title,type='success') {
    toastr.options.timeOut = 4500;
    toastr.options.hideDuration = 250;
    toastr.options.showDuration = 250;
    toastr.options.onShown = () => {  this.getTemplateRanking(); };
    if (type === 'success') {
      toastr.success(text, title);
    }else {
      toastr.error(text, title);
    }
  }
}
export let context = new Context(); //Singleton export