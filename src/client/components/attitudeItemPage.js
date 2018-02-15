import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import {formatDate} from '../lib/utils.js';

class AttitudeItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {   
            attitudeItem:props.attitudeItem,
            studentId:props.studentId,
            handleClickParent:props.handleClick           
        };           
        
    }
    handleInput(event) {
        event.preventDefault();              
        let data={'studentId':this.state.studentId,'idAttitudeTask':this.state.attitudeItem[1].id,'points':this.state.attitudeItem[1].points,'description':this.state.attitudeItem[1].description}
        console.log(JSON.stringify(data));        
        events.publish('dataservice/SaveAttitudeTask',data);     
        debugger;   
        props.handleClickParent();
    }
    render() {
        return (                                
            <button onClick={this.handleInput} id={this.state.attitudeItem[1].id} key={this.state.attitudeItem[1].id} className={'xp btn btn-'+this.state.attitudeItem[1].type}  idat={this.state.attitudeItem[1].id} value={this.state.attitudeItem[1].points}>{this.state.attitudeItem[1].points} {this.state.attitudeItem[1].description}</button>                           
        );
    }
}

export default AttitudeItemPage;