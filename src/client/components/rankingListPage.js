import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import RankingListItemPage from './rankingListItemPage.js';

class RankingListPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {                
            students:props.students,
            gtWeight:props.gtWeight,
            xpWeight:props.xpWeight
        };                
       
        /*this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);      */

    }

    /*handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        events.publish('dataservice/SaveGradedTask',this.state);        
    }*/

    render() {
        let cont =1;
        const studentsItems = this.state.students.map((student) =>
            <RankingListItemPage key={student[0]} index={cont++} student={student} />            
        );
        return (
            <table className="table table-striped table-condensed">
            <thead className="thead-dark">
            <tr>
                <th><a href="#expandedView"><button id="more_gt"><i className="fa fa-hand-o-right fa-1x"></i></button></a></th>
                <th>The harder you work, the luckier you get</th>    
                
                <th>FG 100% = XP {this.state.xpWeight}% + GT {this.state.gtWeight}%</th>
            </tr>
            </thead>
            <tbody id="idTableRankingBody">
                {studentsItems}               
            </tbody>

            </table>
        );
    }
}

export default RankingListPage;
