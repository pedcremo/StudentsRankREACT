import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import AttitudeListItemPage from './attitudeListItemPage.js';
import GradedTaskListItemPage from './gradedTaskListItemPage.js';


class PersonDetailPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            student:props.student.personInstance,
            readOnly:props.readOnly ? true : false         
        };        
       
    }
    
    render() {      
       
        const attitudeTasksItems = this.state.student.attitudeTasks.reverse().map((attitudeItem) =>
            <AttitudeListItemPage key={attitudeItem.id+attitudeItem.timestamp} readOnly={this.state.readOnly} studentId={this.state.student.id} datetime={attitudeItem.timestamp} attitudeInstance={this.state.student.getAttitudeById(attitudeItem.id)} />                                
        );
        
        const gradedTasksItems =  this.state.student.getGradedTasks().map((gtItem) =>
            <GradedTaskListItemPage key={gtItem[0]} studentId={this.state.student.id} gradedTaskInstance={gtItem[1]} />                                
        );
       
        return (
            
            <div>
                <img src={'src/server/data/fotos/'+this.state.student.id+'.jpg'} />
                <h1>{this.state.student.name} {this.state.student.surname} {this.state.student.getFinalGrade()}</h1>
                <h2>{this.state.student.email}</h2>
                {!this.state.readOnly ? <a href={'#editStudent/'+this.state.student.id}><button className='btnS btn btn-success'>&nbsp;<i className='fa fa-pencil fa-1x'></i></button></a> : null}
                
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