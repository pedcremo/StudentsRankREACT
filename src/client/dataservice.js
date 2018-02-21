import {loadTemplate} from './lib/utils.js';
import {context} from './context.js'; //Singleton
import Settings from './classes/settings.js';
import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';
import AttitudeTask from './classes/attitudetask.js';
import {events} from './lib/eventsPubSubs.js';

events.subscribe('dataservice/saveSettings',(settingsJSON) => {
  saveSettings(settingsJSON);
});

events.subscribe('dataservice/saveAttitudeTasks',(attitudeTasksJSON) => {
  saveAttitudeTasks(attitudeTasksJSON);
});
events.subscribe('dataservice/saveGradedTasks',(gradedTasksJSON) => {
  saveGradedTasks(gradedTasksJSON);
});
events.subscribe('dataservice/saveStudents',(studentsJSON) => {
  saveStudents(studentsJSON);
});

/** Get students and grades from server and maintains a local copy in localstorage */
function updateFromServer() {
  if (context.user.id) {    
    loadTemplate('api/getSettings',function(response) {
                          events.publish('dataservice/getSettings',response);                        
                        },'GET','',false);

    loadTemplate('api/getAttitudeTasks',function(response) {
                          events.publish('dataservice/getAttitudeTasks',response);                          
                        },'GET','',false);

    loadTemplate('api/getStudents',function(response) {
                          events.publish('dataservice/getStudents',response);                          
                          context.getTemplateRanking(true);                          
                        },'GET','',false);

    loadTemplate('api/getGradedTasks',function(response) {
                          events.publish('dataservice/getGradedTasks',response);                       
                        },'GET','',false);
    
  }
}
/** Save students in server side */
function saveStudents(arrayStudents) {
  loadTemplate('api/saveStudents',function(response) {
                          console.log('SAVE STUDENTS ' + response);
                        },'POST',arrayStudents,false);
}
/** Save grades in server side */
function saveGradedTasks(arrayGT) {
  loadTemplate('api/saveGradedTasks',function(response) {
                          console.log('SAVE GRADED TASKS ' + response);
                        },'POST',arrayGT,false);
}
/** Save Attitude XP points in server side */
function saveAttitudeTasks(arrayATstr) {
  loadTemplate('api/saveAttitudeTasks',function(response) {
                          console.log('SAVE ATTITUDE TASKS ' + response);
                        },'POST',arrayATstr,false);
}
/** Save settings in server side */
function saveSettings(settingsJSON) {
  loadTemplate('api/saveSettings',function(response) {
                          console.log('SAVE SETTINGS ' + response);
                        },'POST',JSON.stringify(settingsJSON),false);
}
/** Save settings in server side */
function saveSubjects(subjectsJSON,callback) {
  loadTemplate('api/saveSubjects',function(response) {
                          console.log('SAVE SUBJECTS' + response);
                          callback();
                          updateFromServer();   
                        },'POST',JSON.stringify(subjectsJSON),false);
}

export {updateFromServer,saveStudents,saveGradedTasks,saveSettings,saveAttitudeTasks,saveSubjects};