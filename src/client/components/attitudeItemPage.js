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
        
        this.handleXPonClick = this.handleXPonClick.bind(this); 
    }
    handleXPonClick(event) {
        debugger;
        alert("NO ES VERDAD");
    }
    render() {
        return (                                
            <button key={this.state.attitudeItem[1].id} className={'xp btn btn-'+this.state.attitudeItem[1].type} onClick={this.handleXPonClick} idat={this.state.attitudeItem[1].id} value={this.state.attitudeItem[1].points}>{this.state.attitudeItem[1].points} {this.state.attitudeItem[1].description}</button>           
                
        );
    }
}

export default AttitudeItemPage;