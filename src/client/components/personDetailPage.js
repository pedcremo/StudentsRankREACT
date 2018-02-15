import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import AttitudeListItemPage from './attitudeListItemPage.js';
import GradedTaskListItemPage from './gradedTaskListItemPage.js';


class PersonDetailPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            student:props.student.personInstance               
        };        
       
    }
    
    render() {      
       
        const attitudeTasksItems = this.state.student.attitudeTasks.reverse().map((attitudeItem) =>
            <AttitudeListItemPage key={attitudeItem.id+attitudeItem.timestamp} studentId={this.state.student.id} datetime={attitudeItem.timestamp} attitudeInstance={this.state.student.getAttitudeById(attitudeItem.id)} />                                
        );
        
        const gradedTasksItems =  this.state.student.getGradedTasks().map((gtItem) =>
            <GradedTaskListItemPage key={gtItem[0]} studentId={this.state.student.id} gradedTaskInstance={gtItem[1]} />                                
        );
        return (
            <div>
                <img src={'src/server/data/fotos/'+this.state.student.id+'.jpg'} />
                <h1>{this.state.student.name} {this.state.student.surname} {this.state.student.getFinalGrade()}</h1>
  
                <h3>Attitude tasks</h3>                
                <ul className="list-group">                
                    {attitudeTasksItems}                
                </ul>
                
                <h3>Graded tasks</h3>
                <ul className="list-group">
                    {gradedTasksItems}
                </ul>
            </div>
        );
    }
}

export default PersonDetailPage;