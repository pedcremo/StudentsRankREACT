import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class AttitudeListItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {   
            datetime:props.datetime,
            idStudent:props.studentId,            
            attitudeInstance:props.attitudeInstance               
        };   
        debugger;     
    }
    
    render() {

        return (
                <ul className="list-group"> 
                    <li  className="list-group-item"><a href={'#deleteXP/'+ this.state.studentId+'/'+attitudeInstance.id }><button class='btnS btn btn-danger'><i class='fa fa-trash-o fa-1x'></i></button></a> {attitudeInstance.points} -> {attitudeInstance.description} ->  {this.state.datetime} </li>                                   
                </ul>            
        );
    }
}

export default AttitudeListItemPage;