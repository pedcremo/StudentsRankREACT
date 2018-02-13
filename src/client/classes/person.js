/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {array} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {number} id - Person id default value null whwen created first time
 * @tutorial pointing-criteria
 */

import {formatDate,hashcode,loadTemplate,getCookie} from '../lib/utils.js';
import {template} from '../lib/templator.js';
import {events} from '../lib/eventsPubSubs.js';
import {doProxy} from '../lib/proxy.js';
import $ from "jquery";
import React from 'react';
import reactDOM from 'react-dom';
import RankingListPage from '../components/rankingListPage.js';
import Settings from './settings.js';

let students = new Map();
let settings = {};
let attitudeMAP = new Map();
let gradedtaskMAP = new Map();

//Obj
events.subscribe('dataservice/SavePerson',(obj) => {
  let person = {}; 
  debugger;
  //UPDATE
  if (obj.id && obj.id!=='huevon') {  
     person=students.get(obj.id);
     person.name = obj.name;
     person.surname = obj.surnames;      
  //NEW  
  }else{
    person = new Person(obj.name,obj.surnames,[]);
    students.set(person.id,person);      
  }
  //$.post('api/uploadImage', obj.profileImg );
  /*loadTemplate('api/uploadImage',function(response) {
    console.log(response);
  },'POST',obj.profileImg,'false');*/

  events.publish('dataservice/saveStudents',JSON.stringify([...students]));    
  Person.getRankingTable();
}
);
events.subscribe('attitudeTask/change',(obj) => {
  attitudeMAP = obj;  
});

events.subscribe('gradedTask/change',(obj) => {
  gradedtaskMAP = obj;
  Person.getRankingTable();
  
});
events.subscribe('component/changingGTPoints',(obj)=>{
  let gt = gradedtaskMAP.get(parseInt(obj.idGradedTask));
  gt.addStudentMark(obj.idPerson,obj.value);
});

events.subscribe('dataservice/getStudents',(obj) => {
  let students_ = new Map(JSON.parse(obj));
  students_.forEach(function(value_,key_,students_) {
      students_.set(key_,new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.id));
    });
  students = students_;
});

events.subscribe('settings/change',(obj) => {
  settings = obj;
});

events.subscribe('/context/newGradedTask',(gtask) => {
  students.forEach(function(studentItem,studentKey,studentsRef) {
    gtask.addStudentMark(studentKey,0);
  });
});

//Every time students change we inform 'students/change' service
//doProxy([...students.entries()],'students/change');

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalXPpoints = Symbol('TOTAL_XP_POINTS'); /** To acomplish private property */

class Person {
  constructor(name,surname,attitudeTasks,id=null) {
    this[_totalXPpoints] = 0;
    this.name = name;
    this.surname = surname;
    if (!id) {
      this.id = hashcode(this.name + this.surname);
    }else {
      this.id = id;
    }
    this.attitudeTasks = attitudeTasks;
  }

  /** Get person id  based on a 10 character hash composed by name+surname */
  getId() {
    return this.id;
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
  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    let dateTimeStamp = new Date();//Current time
    this.attitudeTasks.push({'id':taskInstance.id,'timestamp':dateTimeStamp});
    events.publish('/context/addXP',{'attitudeTask':taskInstance,'person':this});
   
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
    //events.publish('students/change',[...students.entries()]);
    //Person.getRankingTable();
  }
  /** Delete XP associated to this person */
  deleteXP(taskInstanceId) {
    //console.log('HOLA TINKI WINKI');
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
    try {     
      gradedtaskMAP.forEach((valueGT) => {
        //console.log('MERDA ' + valueGT.id + 'Person id ' + this.id);
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
    //return GradedTask.getStudentGradedTasksPoints(this.getId());
  }
  /** XP mark relative to highest XP mark and XP weight and GT grade */
  getFinalGrade() {

    let xpGrade = this.getXPtotalPoints() * (settings.weightXP) / Person.getMaxXPmark();
    if (isNaN(xpGrade)) {
      xpGrade = 0;
    }
    return Math.round(xpGrade + (this.getGTtotalPoints() * (settings.weightGP / 100)));
  }
  /** Renders person edit form */
  /*getHTMLEdit() {
    let callback = function(responseText) {
      $('#content').html(responseText);
      let saveStudent = $('#newStudent');
      $('#idFirstName').val(this.name);
      $('#idSurnames').val(this.surname);
      let studentProfile = $('#myProfile');
      let outputImg = $('#output');
      outputImg.attr('src','src/server/data/fotos/' + this.getId() + '.jpg');
      let studentThis = this;

      studentProfile.change(() => {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function() {
          let dataURL = reader.result;
          //output = document.getElementById('output');
          outputImg.attr('src',dataURL);
        };
        reader.readAsDataURL(input.files[0]);
      });

      saveStudent.submit(function() {
        let oldId = studentThis.getId();
        studentThis.name = $('#idFirstName').val();
        studentThis.surname = $('#idSurnames').val();
        let student = new Person(studentThis.name,studentThis.surname,studentThis.attitudeTasks,studentThis.id);
        let formData = new FormData(saveStudent[0]);
        let file = studentProfile[0].files[0];
        formData.append('idStudent',student.getId());

        loadTemplate('api/uploadImage',function(response) {
          console.log(response);
        },'POST',formData,'false');
        students.set(student.getId(),student);
        events.publish('dataservice/saveStudents',JSON.stringify([...students]));        
      });
    }.bind(this);

    loadTemplate('templates/addStudent.html',callback);
  }*/
  /** Renders person detail view */
  getHTMLDetail() {
    loadTemplate('templates/detailStudent.html',function(responseText) {
        let TPL_STUDENT = this;
        let scope = {};
        scope.TPL_ATTITUDE_TASKS = [];
        this.attitudeTasks.reverse().forEach(function(atItem) {
          let itemAT = attitudeMAP.get(parseInt(atItem.id));
          itemAT.datetime = atItem.timestamp;
          scope.TPL_ATTITUDE_TASKS.push(itemAT);
        });
        let TPL_GRADED_TASKS = '';
        gradedtaskMAP.forEach(function(gtItem) {
          TPL_GRADED_TASKS += '<li class="list-group-item">' + gtItem.getStudentMark(TPL_STUDENT.getId()) + '->' +
                        gtItem.name + '->' + formatDate(new Date(gtItem.datetime)) + '</li>';
        });
        let out = template(responseText,scope);
        console.log(out);
        $('#content').html(eval('`' + out + '`'));
      }.bind(this));
  }
  /** Add a new person to the context app */
  /*static addPerson() {
    let callback = function(responseText) {
            $('#content').html(responseText);
            let saveStudent = $('#newStudent');
            let studentProfile = $('#myProfile');

            studentProfile.change(function(event) {
              let input = event.target;
              let reader = new FileReader();
              reader.onload = function() {
                let dataURL = reader.result;
                let output = $('#output');
                output.src = dataURL; 
              };
              reader.readAsDataURL(input.files[0]);
            });

            saveStudent.submit(function(event) {
              event.preventDefault();
              let name = $('#idFirstName').val();
              let surnames = $('#idSurnames').val();
              let student = new Person(name,surnames,[]);
              var formData = new FormData(saveStudent[0]);
              var file = studentProfile[0].files[0];
              formData.append('idStudent',student.getId());

              loadTemplate('api/uploadImage',function(response) {
                console.log(response);
              },'POST',formData,'false');

              Person.addStudent(student);
              return false; //Avoid form submit              
            });
          };

    loadTemplate('templates/addStudent.html',callback);
  }*/
  static getPersonById(idHash) {
    return students.get(parseInt(idHash));
  }
  static getRankingTable(umount=false) {
    
    //if (students && students.size > 0) {
      /* We sort students in descending order from max number of points to min when we are in not expanded view */
      let arrayFromMap = [...students.entries()];
      let fingerPrintBeforeSort = arrayFromMap.toString();
      if ($('.tableGradedTasks').is(':hidden')) {
        arrayFromMap.sort(function(a,b) {
           return (b[1].getFinalGrade() - a[1].getFinalGrade());
        });
      }
      students = new Map(arrayFromMap);
      //debugger;
      if (arrayFromMap.toString()!==fingerPrintBeforeSort) {
        umount=true ;
      }

      if (umount) reactDOM.unmountComponentAtNode(document.getElementById('content')); //umount react component
      reactDOM.render(<RankingListPage gtWeight={Settings.getGtWeight()} xpWeight={Settings.getXpWeight()} students= {Person.getStudentsFromMap()}  />, document.getElementById('content'));
       
  }
  /*static addStudent(studentInstance) {
    //events.publish('student/new',studentInstance);
    students.set(studentInstance.getId(),studentInstance);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));    
    Person.getRankingTable();    
  } */
  static getStudentsSize() {
    return students.size;
  }
  static getStudentsFromMap() {
    return [...students.entries()];
    //return students;
  }
  static deleteById(idPerson) {
    students.delete(idPerson);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }
}

export default Person;
