/**
 * AttitudeTask class. Create a attitude task in order to be
 * assigned to an individual or group of students. This could be for
 * example , participative attitude at class. Point a good 
 * question in class. Be the first finishing some exercise ...
 * 
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {string} points - task points associated to that behaviour
 * @param {string} hits - times an attitudeTask has been used by everyone
 * @tutorial pointing-criteria
 */

import Task from './task.js';
import {loadTemplate} from '../lib/utils.js';
import {events} from '../lib/eventsPubSubs.js';
import Person from './person.js';

let attitudeTasks = new Map();

events.subscribe('dataservice/getAttitudeTasks',(obj) => {
  let attitudeTasks_ = new Map(JSON.parse(obj));
  attitudeTasks_.forEach(function(value_,key_,attitudeTasks_) {
      attitudeTasks_.set(key_,new AttitudeTask(value_.name,value_.description,value_.points,
        value_.hits,value_.id));
    });
  attitudeTasks = attitudeTasks_;
  events.publish('attitudeTask/change',attitudeTasks);
});

events.subscribe('dataservice/SaveAttitudeTask',(obj) => {
  //Assign ATTITUDE
  let p=Person.getPersonById(obj.studentId);
  let at;
  if (!obj.idAttitudeTask) {
  //Create new task and assign
    at = new AttitudeTask(obj.description,obj.description,obj.points);       
    attitudeTasks.set(at.id,at);     
    let prova = [...attitudeTasks];
    events.publish('dataservice/saveAttitudeTasks',JSON.stringify(prova));           
  //Assign an existing task     
  }else{
    at = attitudeTasks.get(parseInt(obj.idAttitudeTask));            
  }
  at.hits++;
  p.addAttitudeTask(at);
});

class AttitudeTask extends Task {
  constructor(name,description,points,hits=0,id=null) {
    super(name,description,id);
    this.points = points;
    this.hits = hits;
    this.type = (this.points >= 0) ? 'success' : 'danger';//Positive or negative attitude
  }
  static getAttitudeTasks() {
    return [...attitudeTasks.entries()];
  } 
  static getAttitudeById(idTask) {
    return attitudeTasks.get(idTask);
  }
}

export default AttitudeTask;