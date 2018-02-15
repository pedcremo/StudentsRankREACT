import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import {formatDate} from '../lib/utils.js';

class AttitudeItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {   
            attitudeItem:props.attitudeItem,
            studentId:props.studentId            
        };   
        
        this.handleInput = this.handleInput.bind(this); 
    }
    handleInput(event) {
        debugger;
        alert("NO ES VERDAD");
    }
    render() {
        return (                                
            <button onClick={this.handleInput} style={{overlay: {zIndex: -99}}} key={this.state.attitudeItem[1].id} className={'xp btn btn-'+this.state.attitudeItem[1].type}  idat={this.state.attitudeItem[1].id} value={this.state.attitudeItem[1].points}>{this.state.attitudeItem[1].points} {this.state.attitudeItem[1].description}</button>           
                
        );
    }
}

export default AttitudeItemPage;