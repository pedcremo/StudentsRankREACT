'use strict';
import {context} from './context.js';
import {deleteCookie,setCookie,loadTemplate} from './lib/utils.js';
import {updateFromServer} from './dataservice.js';

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
  let output = '';
  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="">' + context.user.displayName + '</a></li>';
  }
  let subjects = context.user.subjects;
  output += '<li class="nav-item"><select id="subjectsItems">';
  for (let i = 0;i < subjects.length;i++) {
    if (subjects[i] === context.user.defaultSubject) { 
      output += '<option selected value="' + subjects[i] + '">' + subjects[i] + '</option>';
    }else {
      output += '<option value="' + subjects[i] + '">' + subjects[i] + '</option>';
    }
  }
  output += '<option value="NEW subject">NEW subject</option>';
  output += '</select><br><span id="termMenu">' + context.settings.defaultTerm + '</span></li>';

  output += '<li class="nav-item"><a class="nav-link" href="#addStudent"><button class="btn btn-secondary"> + Student</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#addGradedTask"><button class="btn btn-secondary"> + Graded task</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#settings"><button class="btn btn-secondary">Settings</button></a></li>';

  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="#logout"><button class="btn btn-danger"> LOGOUT</button></a></li>';
  }
  $('#menuButtons').html(output);
  $('#subjectsItems').change(function() {
    let optionSubject = $(this).children(':selected').val();
    if (optionSubject === 'NEW subject') {
      let callback = function(responseText) {
        $('#content').html($('#content').html() + responseText);
        $('#SubjectModal').modal('toggle');
        $('#newSubject').submit((event) => {
          event.preventDefault();
          loadTemplate('api/addSubject',function(response) {
            context.user.defaultSubject = $('#subjectName').val();
            updateFromServer();
            context.getTemplateRanking();
          },'GET','newSubject=' + $('#subjectName').val(),false);
          $('.modal-backdrop').remove();
          return false; //Abort submit
        });
      };
      loadTemplate('templates/addSubject.html',callback);
    }else {
      context.user.defaultSubject = optionSubject;
      setCookie('user',JSON.stringify(context.user),7);
      loadTemplate('api/changeSubject',function(response) {
        updateFromServer();
        context.getTemplateRanking();
      },'GET','newsubject=' + optionSubject,false);
    }
  });
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
                document.location.href="/";
              },'GET','',false);
}
export {generateMenu,logout,showMenu,hideMenu};