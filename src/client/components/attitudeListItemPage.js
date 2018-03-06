import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import {formatDate} from '../lib/utils.js';

class AttitudeListItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {   
            datetime:props.datetime,
            studentId:props.studentId,            
            attitudeInstance:props.attitudeInstance,
            readOnly:props.readOnly             
        };   
         
    }
    
    render() {
        return (               
                    <li  className="list-group-item">{!this.state.readOnly ?<a href={'#deleteXP/'+ this.state.studentId+'/'+this.state.attitudeInstance.id }><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i></button></a>:null} {this.state.attitudeInstance.points} points due to {this.state.attitudeInstance.description} on  {formatDate(new Date(this.state.datetime))} </li>                                
                       
        );
    }
}

export default AttitudeListItemPage;