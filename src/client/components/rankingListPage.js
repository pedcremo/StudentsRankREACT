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
        
        events.subscribe('students/change',(obj) => {            
            this.setState({
                students: obj
            });
            console.log("SETSTATE");
        });
        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(event){
        console.log("EXPANDED_SSS");
        $('.tableGradedTasks').toggle();
       
        
        if ($('.tableGradedTasks').is(':visible')) {
          //setCookie('expandedView','visible',345);
          $('.fa-hand-o-right').addClass('fa-hand-o-down').removeClass('fa-hand-o-right');
        }else {
          //setCookie('expandedView','hidden',345);
          $('.fa-hand-o-down').addClass('fa-hand-o-right').removeClass('fa-hand-o-down');
          //events.publish('component/ranking');
        }
    }
    
    render() {
        let cont =1;
        const studentsItems = this.state.students.map((student) =>
            <RankingListItemPage key={student[0]} index={cont++} student={student} />            
        );
        console.log("RENDER");
        return (
            <table className="table table-striped table-condensed">
            <thead className="thead-dark">
            <tr>
                <th><a href="#expandedView" onClick={this.handleClick}><button id="more_gt"><i className="fa fa-hand-o-right fa-1x"></i></button></a></th>
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
