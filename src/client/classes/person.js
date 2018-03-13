'use strict';

import {context} from '../context.js'; //Singleton
import {formatDate,updateObject,hashcode,loadTemplate,getCookie} from '../lib/utils.js';
import {events} from '../lib/eventsPubSubs.js';
import $ from "jquery";
import React from 'react';
import reactDOM from 'react-dom';
import RankingListPage from '../components/rankingListPage.js';
import Settings from './settings.js';
import {getIdFromURL} from '../lib/utils.js';
import PersonDetailPage from '../components/personDetailPage.js';

/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {string} email - Person email
 * @param {string} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {number} id - Person id default value null whwen created first time
 * @tutorial pointing-criteria
 */
  
let students = new Map();
let attitudeMAP = new Map();
let gradedtaskMAP = new Map();

//Obj
events.subscribe('dataservice/SavePerson',(obj) => {
  let person = {};   
  //UPDATE
  if (obj.studentProps.id && obj.studentProps.id!=='huevon') {      
     person=students.get(obj.studentProps.id);    
     person=updateObject(person,obj.studentProps);
     events.publish('dataservice/saveStudents',JSON.stringify([...students]));      
     Person.getRankingTable();
  //NEW  
  }else{
    person = new Person(obj.studentProps.name,obj.studentProps.surname,obj.studentProps.email,[]);
    //students.set(person.id,person);      
    Person.addStudent(person);
  }
  obj.formData.append('idStudent',person.id);        
  loadTemplate('api/uploadImage',function(response) {
          console.log(response);
  },'POST',obj.formData,'false');   
  
  }
);

events.subscribe('attitudeTask/change',(obj) => {
  attitudeMAP = obj;  
});

events.subscribe('gradedTask/change',(obj) => {
  gradedtaskMAP = obj;
  Person.getRankingTable();
  events.publish('students/change',Person.getStudentsFromMap());  
});
events.subscribe('component/changingGTPoints',(obj)=>{
  let gt = gradedtaskMAP.get(parseInt(obj.idGradedTask));
  gt.addStudentMark(obj.idPerson,obj.value);
});

events.subscribe('dataservice/getStudents',(obj) => {
  let students_ = new Map(JSON.parse(obj));
  students_.forEach(function(value_,key_,students_) {
      students_.set(key_,new Person(value_.name,value_.surname,value_.email,
          value_.attitudeTasks,value_.id));
    });
  students = students_;
  events.publish('students/change',Person.getStudentsFromMap());//REACT component RankingListPage gets informed
});

events.subscribe('/context/newGradedTask',(gtask) => {
  students.forEach(function(studentItem,studentKey,studentsRef) {
    gtask.addStudentMark(studentKey,0);
  });
});

events.subscribe('/component/selectedAction',(obj) =>{
  switch (obj.option){
    case 'deleteall':
      Person.deleteAllById(obj.arraySelecteds);
    break;
  }
});


const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalXPpoints = Symbol('TOTAL_XP_POINTS'); /** To acomplish private property */

class Person {
  constructor(name,surname,email,attitudeTasks,id=null) {
    this[_totalXPpoints] = 0;
    this.name = name;
    this.surname = surname;
    this.email = email;
    if (!id) {
      this.id = hashcode(this.name + this.surname);
    }else {
      this.id = id;
    }
    this.attitudeTasks = attitudeTasks;
  }

  /** Read person _totalXPpoints. A private property only modicable inside person instance */
  getXPtotalPoints() {
    this[_totalXPpoints] = 0;
    try {
      this.attitudeTasks.forEach(function (itemAT) {
        if (attitudeMAP.size > 0) {
          let instanceAT = attitudeMAP.get(parseInt(itemAT.id));
          try {
            this[_totalXPpoints] += parseInt(instanceAT.points);
          } catch (error) {
            this[_totalXPpoints] += 0;
          }
        }
      }.bind(this));
    }catch (err) {
      console.log('ERROR:' + err);
    }

    return this[_totalXPpoints];
  }

  /** returns max XP grade used to calculate XP mark for each student */
  static getMaxXPmark() {
    let max = 0;
    students.forEach(function(studentItem,studentKey,studentsRef) {
      if (studentItem.getXPtotalPoints() > max) {
        max = studentItem.getXPtotalPoints();
      }
    });
    return max;
  }
  getAttitudeById(idAttitude) {
    return attitudeMAP.get(parseInt(idAttitude));
  }
  getGradedTasks(){
    return [...gradedtaskMAP.entries()]
  }
  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    let dateTimeStamp = new Date();//Current time   
    this.attitudeTasks.push({'id':taskInstance.id,'timestamp':dateTimeStamp});
    events.publish('/context/addXP',{'attitudeTask':taskInstance,'person':this});   
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }

  /** Delete XP associated to this person */
  deleteXP(taskInstanceId) {
    this.attitudeTasks.forEach((itemAT) => {
        if (itemAT.id == taskInstanceId) {
          let index = this.attitudeTasks.indexOf(itemAT);
          if (index > -1) {
            this.attitudeTasks.splice(index, 1);
          }
        }
      });  
         
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }

  /** Get students Marks in current term from context from newer to older */
  getStudentMarks() {
    let gtArray = [];
    let settings = Settings.getSettings();
    try {     
      gradedtaskMAP.forEach((valueGT) => {
        if (valueGT.term === settings.defaultTerm || settings.defaultTerm ==='ALL') {
          gtArray.push({'id':valueGT.id,'idStudent':this.id,'points':valueGT.studentsMarkMAP.get(this.id),'name':valueGT.name,'weight':valueGT.weight});
        }
      });
    }catch (err) {
      console.log('ERROR' + err);
    }
    return gtArray.reverse();
  }

  /** Get total points over 100 taking into account different graded tasks weights */
  getGTtotalPoints() {
    let points = 0;
    let settings = Settings.getSettings();
    try {
      gradedtaskMAP.forEach((itemTask) => {
        if (itemTask.term === settings.defaultTerm || settings.defaultTerm === 'ALL') {
          points += itemTask.studentsMarkMAP.get(this.id) * (itemTask.weight / 100);
        }
      });
    } catch (err) {
      console.log(err);
    }
    
    if (isNaN(points)) {
      points=0;
    }
    return Math.round((points * 100) / 100);    
  }
  /** XP mark relative to highest XP mark and XP weight and GT grade */
  getFinalGrade() {
    let settings = Settings.getSettings();
    let xpGrade = this.getXPtotalPoints() * (settings.weightXP) / Person.getMaxXPmark();
    if (isNaN(xpGrade)) {
      xpGrade = 0;
    }
    let fg = Math.round(xpGrade + (this.getGTtotalPoints() * (parseInt(settings.weightGP) / 100)));
    if (isNaN(fg)) {
      fg='?';
    }
    return fg;
  }
  
  static getPersonById(idHash) {
    return students.get(parseInt(idHash));
  }
  
  static getRankingTable(umount=false) {    
      /* We sort students in descending order from max number of points to min when we are in not expanded view */
      let arrayFromMap = [...students.entries()];
      let fingerPrintBeforeSort = arrayFromMap.toString();
      if ($('.tableGradedTasks').is(':hidden')) {
        arrayFromMap.sort(function(a,b) {
           return (b[1].getFinalGrade() - a[1].getFinalGrade());
        });
      }
      students = new Map(arrayFromMap);
      if (arrayFromMap.toString()!==fingerPrintBeforeSort) {
        umount=true ;
      }
     
      if (umount) {
        reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
      }
      
      let displayName = '';
      try{
        displayName = context.user.displayName;
      }catch(err){
        displayName = '';
      }
      reactDOM.render(<RankingListPage displayName={displayName} defaultTerm={Settings.getDefaultTerm()} gtWeight={Settings.getGtWeight()} xpWeight={Settings.getXpWeight()} students= {Person.getStudentsFromMap()} selectedIds={context.selectedIds}  />, document.getElementById('content'));       

            // On link single click
      $('.studentLink').click(function (event) {
        let href = $(this).attr('href');
        let link = $("#prueba");
        // Redirect only after 500 milliseconds
        if (!$(this).data('timer')) {
           $(this).data('timer', setTimeout(function () {
             event.preventDefault();
             window.location = href;
             reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
             let personInstance = Person.getPersonById(getIdFromURL(href));
             reactDOM.render(<PersonDetailPage student={{personInstance}} readOnly={context.readOnly} />, document.getElementById('content'));
           }, 500));
        }
        return false; // Prevent default action (redirecting)
      });
    
      // On link double click
      $('.studentLink').dblclick(function () {
          clearTimeout($(this).data('timer'));
          $(this).data('timer', null);
          // Do something else on double click
          
          var dad = $(this).parent().parent();
          var labelChild = dad.find('label');
          var labelValue = labelChild.text();
          
          //Hide the label and show input text
          labelChild.hide();
          dad.find('input[type="text"]').show().focus().val(labelValue);
      
          return false;
      });

      $('.edit-input').each(function(index) {
        $(this).keypress(function(e){
          if(e.which == 13){
              $(this).focusout();    
          }
        });
      });

      // On input focus out
      $('input[type=text]').focusout(function() {
        if (!$(this).val()==""){
          let person = {};
          let idStudent = this.getAttribute('idstudent');   
          person=students.get(parseInt(idStudent));
          let idNameInput = this.id;
          
          switch(idNameInput){
            case "nameInput":
              let newName = $(this).val(); 
              person.name = newName;
              break;
              
            case "surnamesInput":
              let newSurnames= $(this).val(); 
              person.surname = newSurnames;
              break;

            case "emailInput":
              let newEmail = $(this).val(); 
              person.email = newEmail;
              break;
          }

          //Save student
          events.publish('dataservice/saveStudents',JSON.stringify([...students]));      
          Person.getRankingTable();
        } else {
          //alert("The field can't be blank.");
        }
          //Show the label and hide input text
          var dad = $(this).parent();
          $(this).hide();
          dad.find('label').show();
      });
    }

  static addStudent(studentInstance) {    
    students.set(studentInstance.id,studentInstance);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));    
    Person.getRankingTable();    
  } 

  static getStudentsSize() {
    return students.size;
  }

  static getStudentsFromMap() {
    return [...students.entries()];    
  }

  static deleteById(idPerson) {
    students.delete(idPerson);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }

  static deleteAllById(arrayIds) {

    if (window.confirm('Are you sure?')) {
          arrayIds.forEach(function(idPerson){
          students.delete(idPerson);
        });
        events.publish('dataservice/saveStudents',JSON.stringify([...students]));
    }
      Person.getRankingTable(true); 
    }
}

export default Person;
