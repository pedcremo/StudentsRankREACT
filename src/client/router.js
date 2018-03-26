import {context} from './context.js'; //Singleton
import {getIdFromURL,setCookie,loadTemplate} from './lib/utils.js';
import {logout,generateMenu} from './menu.js';
import AttitudeTask from './classes/attitudetask.js';
import GradedTask from './classes/gradedtask.js';
import Person from './classes/person.js';
import Settings from './classes/settings.js';
import {saveStudents} from './dataservice.js';
import GradedTaskPage from './components/gradedTaskPage.js';
import RankingListPage from './components/rankingListPage.js';
import PersonPage from './components/personPage.js';
import PersonDetailPage from './components/personDetailPage.js';
import SettingsPage from './components/settingsPage.js';
import FooterPage from './components/footerPage.js';
import LogoPage from './components/logoPage.js';
import React from 'react';
import reactDOM from 'react-dom';
import {events} from './lib/eventsPubSubs.js';
import $ from "jquery";
import ListAttitudeTaskPage from './components/listAttitudeTaskPage.js';
import { debug } from 'util';

let settings;
events.subscribe('settings/change',(obj) => {
  settings = obj;
});
/** Primitive routing mechanism based on detecting clicks on links and get the URL */
function initRouter() {
  reactDOM.render(<LogoPage />, document.getElementById('logo'));
  reactDOM.render(<FooterPage />, document.getElementsByTagName('footer')[0]);
  
  /*window.addEventListener('hashchange', function(){
    let hash = location.hash;
    let a = hash.split('/');
    console.log('--HASHCHANGE--');
    console.log(a[0]);
    if(a[0] === '#code') {
      console.log('code');
      events.publish('context/loginCode',a[1]);
    }
  });*/
  /*let hash = location.hash;
  console.log(location.hash)
  let a = hash.split('/');
  if(a[0] === '#code'){
    console.log('code');
    events.publish('context/loginCode',a[1]);
  }*/
  
  var routerFunction = function(e) {
        //e = e || event;
        //var isLink = findParent('a',e.target || e.srcElement);
        debugger;
        let isLink = {};
        isLink.href = window.location.href;
        if (isLink) {
          
          switch (true) {
            /** View Student information detail */
            case /#student/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              let personInstance = Person.getPersonById(getIdFromURL(isLink.href));
              reactDOM.render(<PersonDetailPage student={{personInstance}} readOnly={context.readOnly} />, document.getElementById('content'));             
              break;
            /** Modify student information */
            case /#editStudent/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              personInstance = Person.getPersonById(getIdFromURL(isLink.href));
              reactDOM.render(<PersonPage student={{personInstance}} readOnly={context.readOnly}  />, document.getElementById('content'));              
              break;
            /** Delete student with confirmation */
            case /#deleteStudent/.test(isLink.href):
              if (window.confirm('Are you sure?')) {
                Person.deleteById(parseInt(getIdFromURL(isLink.href)));                
                context.getTemplateRanking(true);
              }
              break;
            /** Delete Xp associated to a person */
            case /#deleteXP/.test(isLink.href):
              if (window.confirm('Are you sure?')) {
                var reg = /\/{1}([0-9,-]+)\//;
                var matchResults = isLink.href.match(reg);
                personInstance = Person.getPersonById(matchResults[1]);
                personInstance.deleteXP(parseInt(getIdFromURL(isLink.href)));
                reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
                reactDOM.render(<PersonDetailPage student={{personInstance}} readOnly={context.readOnly} />, document.getElementById('content'));                
              }
              break;
             /** Delete Subject */
             case /#deleteSubject/.test(isLink.href):
               let arraydelete = isLink.href.split("/");
               let selectedSubject  = arraydelete.pop();
               if (window.confirm('Are you sure you want to delete '+selectedSubject+' and all linked students?')) {
                context.deleteSubject(selectedSubject);                     
               }else {
                context.isLogged();
               }
             break;
              /** Edit Subject */
             case /#editSubject/.test(isLink.href):
               let array = isLink.href.split("/");
               let newname = array.pop();
               let subject = context.user.defaultSubject;
               context.editSubject(newname);
             break;
            /** Show popup associated to an student in order to assign XP points  */
            case /#addXP/.test(isLink.href):
              personInstance = Person.getPersonById(getIdFromURL(isLink.href));
              reactDOM.unmountComponentAtNode(document.getElementById('modals')); //umount react component              
              reactDOM.render(<ListAttitudeTaskPage students={[personInstance]} attitudeTasks={AttitudeTask.getAttitudeTasks()} />, document.getElementById('modals'));
              break;
            /** Add new student form */
            case /#addStudent/.test(isLink.href):              
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              reactDOM.render(<PersonPage student={{}} />, document.getElementById('content'));             
              break;
            case /#settings/.test(isLink.href):              
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component              
              let code = '';
              let defaultSubject =context.user.defaultSubject;
              debugger;
              if (defaultSubject && defaultSubject !=='default') {
                loadTemplate('api/getCode',function(response) {
                  reactDOM.render(<SettingsPage defaultSubject={context.user.defaultSubject} props={Settings.getSettings()} code={response}/>, document.getElementById('content'));
                },'GET','idSubject=' + context.user.defaultSubject,false);
              }   
              break;
            /** logout */
            case /#logout/.test(isLink.href):
              logout();
              break;
            /** Add new Graded Task form */
            case /#addGradedTask/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              reactDOM.render(<GradedTaskPage terms={settings.terms} props={{term:settings.defaultTerm}} allowedWeight={(100 - GradedTask.getGradedTasksTotalWeight())} />, document.getElementById('content'));             
              break;
            case /#detailGradedTask/.test(isLink.href):
              reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
              let gtInstance = GradedTask.getGradedTaskById(getIdFromURL(isLink.href));               
              reactDOM.render(<GradedTaskPage terms={settings.terms} props={gtInstance} allowedWeight={(100 - GradedTask.getGradedTasksTotalWeight() + parseInt(gtInstance.weight))} />, document.getElementById('content'));             	             
              break;        
            default:
              //debugger;
              context.isLogged();
          }
        }
    };
    
    //HACK / WORKAROUND to detect click on same href without url change
    $(document).on('click','a',function(event) {      
      //debugger;
      var isLink = findParent('a',event.target || event.srcElement);
      if (window.location.href === isLink.href) routerFunction();
      else console.log("NO FAIG RES");
    });
    $(window).bind('hashchange',routerFunction);
}


//$(window).bind('hashchange',routerFunction);
/** find first parent with tagName [tagname] so nested links <a> are triggered too */
function findParent(tagname,el) {
  while (el) {
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}

export {initRouter};
