'use strict';

import Task from './task.js';
import Settings from './settings.js';
import {loadTemplate,updateObject} from '../lib/utils.js';
import {events} from '../lib/eventsPubSubs.js';
import $ from "jquery";

/**
 * GradedTask class. Create a graded task in order to be evaluated 
 * for every student engaged. Theory tests and procedure practices 
 * are part of this category.
 * 
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {number} weight - task weight %
 * @param {Map} studentsMark - Id student and mark pairs
 * @param {string} term - term of the graded task
 * @param {number} id - task id default null when created for first time
 * @tutorial pointing-criteria
 */

let gradedTasks = new Map();

events.subscribe('dataservice/SaveGradedTask',(obj) => {
    let gt = {}; 
    //UPDATE
    if (obj.id) {  
       gt=gradedTasks.get(obj.id);
       gt=updateObject(gt,obj);      
    //NEW  
    }else{
      gt = new GradedTask(obj.name,obj.description,obj.weight,[],obj.term);
      gradedTasks.set(gt.id,gt);      
    }
    events.publish('gradedTask/change',gradedTasks);
    events.publish('/context/newGradedTask',gt);
    events.publish('dataservice/saveGradedTasks',JSON.stringify([...gradedTasks]));
  }
);

events.subscribe('dataservice/getGradedTasks',(obj) => {
  let gradedTasks_ = new Map(JSON.parse(obj));
  gradedTasks_.forEach(function(value_,key_,gradedTasks_) {
      gradedTasks_.set(key_,new GradedTask(value_.name,value_.description,value_.weight,
          value_.studentsMark,value_.term,value_.id));
    });

  gradedTasks = gradedTasks_;
  events.publish('gradedTask/change',gradedTasks);
});

events.subscribe('students/new',(obj) => {
  gradedTasks.forEach(function(iGradedTask) {
    iGradedTask.addStudentMark(obj.getId(),0);
  });
});

class GradedTask extends Task {
  constructor(name,description,weight,studentsMark,term,id=null) {
    super(name,description,id);
    this.weight = weight;
    this.studentsMark = studentsMark;
    if (!term) {      
      term = Settings.getSettings().defaultTerm() || 1;
    }
    this.term = term;
    this.studentsMarkMAP = new Map(studentsMark);
  }

  static getGradedTasks() {
    return gradedTasks;
  }
  /** Get a GradedTask instance by its ID */
  static getGradedTaskById(idHash) {
    return gradedTasks.get(parseInt(idHash));
  }
  /** Add student mark using his/her person ID   */
  addStudentMark(idStudent,markPoints) {
    this.studentsMarkMAP.set(parseInt(idStudent),markPoints);
    this.studentsMark = [...this.studentsMarkMAP.entries()];
    events.publish('dataservice/saveGradedTasks',JSON.stringify([...gradedTasks]));
    events.publish('gradedTask/change',gradedTasks);
  } 
  /** Calculate total aggregated GT weight */
  static getGradedTasksTotalWeight() {
    let points = 0;
    gradedTasks.forEach(function(itemTask) {
      if (itemTask.term === Settings.getSettings().defaultTerm) {
        points += parseInt(itemTask.weight);
      }
    });
    return points;
  }
  /** Get student mark by their person ID */
  getStudentMark(idStudent) {
    return this.studentsMarkMAP.get(idStudent);
  }

  static getGradedTasksFromMap() {
    return [...gradedTasks.entries()];   
  }  
}

export default GradedTask;
