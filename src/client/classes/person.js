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

import {formatDate,updateObject,hashcode,loadTemplate,getCookie} from '../lib/utils.js';
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
  //UPDATE
  if (obj.studentProps.id && obj.studentProps.id!=='huevon') {      
     person=students.get(obj.studentProps.id);    
     person=updateObject(person,obj.studentProps);
     events.publish('dataservice/saveStudents',JSON.stringify([...students]));      
     Person.getRankingTable();
  //NEW  
  }else{
    person = new Person(obj.studentProps.name,obj.studentProps.surnames,[]);
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
  events.publish('students/change',Person.getStudentsFromMap());//REACT component RankingListPage gets informed
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
    let xpGrade = this.getXPtotalPoints() * (settings.weightXP) / Person.getMaxXPmark();
    if (isNaN(xpGrade)) {
      xpGrade = 0;
    }
    return Math.round(xpGrade + (this.getGTtotalPoints() * (settings.weightGP / 100)));
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
      reactDOM.render(<RankingListPage gtWeight={Settings.getGtWeight()} xpWeight={Settings.getXpWeight()} students= {Person.getStudentsFromMap()}  />, document.getElementById('content'));
       
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
    //return students;
  }
  static deleteById(idPerson) {
    students.delete(idPerson);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }
}

export default Person;
