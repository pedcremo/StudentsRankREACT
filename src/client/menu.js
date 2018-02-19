'use strict';
import {context} from './context.js';
import {deleteCookie,setCookie,loadTemplate} from './lib/utils.js';
import {updateFromServer} from './dataservice.js';
import {events} from './lib/eventsPubSubs.js';
import $ from "jquery";
import React from 'react';
import reactDOM from 'react-dom';
import MenuPage from './components/menuPage.js';
import SubjectModalPage from './components/subjectModalPage.js';
//import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.js';

//import modal from "bootstrap";
events.subscribe('menu/addsubject',(obj) => {
  loadTemplate('api/addSubject',function(response) {
    
    console.log(response)
    context.user.defaultSubject = obj.addsubject
    context.user.subjects.push(obj.addsubject);
    //updateFromServer();
    //updateFromServer();
    $('#SubjectModal').modal('toggle');
    
    context.getTemplateRanking();
    //document.location.href = '/';
    events.publish('/context/newGradedTask',null);
    if (funcCallback) funcCallback();
    
  },'GET','newSubject=' + obj.addsubject + '&sharedGroup=' + obj.selectedShared,false);
});

events.subscribe('menu/changesubject',(obj) => {

      context.user.defaultSubject = obj.defaultSubject;
      
      setCookie('user',JSON.stringify(context.user),7);
      loadTemplate('api/changeSubject',function(response) {
        updateFromServer();
        console.log("____________----------_________")
        context.getTemplateRanking();
      },'GET','newsubject=' + obj.defaultSubject,false);

});
let settings = {};
events.subscribe('settings/change',(obj) => {
  settings = obj;
});
/** Show Menu  */
function showMenu() {
  $('#navbarNav').show();
}
/** Hide Menu */
function hideMenu() {
  let sel = $('#navbarNav');
  sel.show().hide();
}
/** Generate menu options taking into account logged in user */
function generateMenu() {
  //reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component  
  
  loadTemplate('api/getSharedGroups',function(response) {
    let sharedGroups = JSON.parse(response)
    let menudata = {'displayName' : context.user.displayName , 'subjects': context.user.subjects, 'defaultSubject': context.user.defaultSubject, 'defaultTerm' : settings.defaultTerm, 'sharedGroups': sharedGroups}
    console.log(menudata)
  reactDOM.render(<MenuPage key={context.user} props={menudata} />, document.getElementById('menuButtons'));    
  },'GET','',false);
 
}
/** Logout. Delete session in server side and credentials in client side */
function logout() {
  context.user = '';
  deleteCookie('user');
  deleteCookie('connect.sid');
  hideMenu();
  loadTemplate('api/logout',function(response) {
                context.clear();
                context.login();
                document.location.href = '/';
              },'GET','',false);
}

function addSubject(funcCallback) {
  loadTemplate('api/getSharedGroups',function(response) {
    let sharedGroups = JSON.parse(response)
    reactDOM.unmountComponentAtNode(document.getElementById('modals'));
    reactDOM.render(<SubjectModalPage  props={sharedGroups}/>, document.getElementById('modals'));   
  },'GET','',false);
  
}
export {generateMenu,addSubject,logout,showMenu,hideMenu};