import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import RankingListItemPage from 'rankingListItemPage.js';

class RankingListPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {                
            students:props.students
        };        
        const studentsItems = this.state.students.map((student) =>
            <RankingListItemPage student={student} />
        );
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
        return (
            <table class="table table-striped table-condensed">
            <thead class="thead-dark">
            <tr>
                <th><a style="float:left;" href="#expandedView"><button id="more_gt"><i class="fa fa-hand-o-right fa-1x"></i></button></a></th>
                <th>The harder you work, the luckier you get</th>    
                <th>FG 100% = XP ${TPL_XP_WEIGHT}% + GT ${TPL_GT_WEIGHT}%</th>
            </tr>
            </thead>
            <tbody id="idTableRankingBody">
                <RankingListItemPage /> 
            </tbody>

            </table>
        );
    }
}

export default RankingListItemPage;
