import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import {formatDate} from '../lib/utils.js';

class GradedTaskListItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {   
            
            studentId:props.studentId,            
            gtItem:props.gradedTaskInstance               
        };   
        debugger;     
    }
    
    render() {

        return (                 
            <li className="list-group-item">{this.state.gtItem.getStudentMark(this.state.studentId)+ '% doing '+ this.state.gtItem.name + ' on ' + formatDate(new Date(this.state.gtItem.datetime))}</li>           
        );
    }
}

export default GradedTaskListItemPage;