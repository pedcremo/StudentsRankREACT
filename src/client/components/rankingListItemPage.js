import React from 'react';
//import {events} from '../lib/eventsPubSubs.js';
import RankingListItemGradedTasksPage from './rankingListItemGradedTasksPage.js';

class RankingListItemPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {                
            id:props.student[0],         
            student:props.student[1],
            /*name: props.student[1].name,
            surnames: props.student[1].surname,            
            fg:props.student[1].getFinalGrade(),
            xp:props.student[1].getXPtotalPoints(),
            gt:props.student[1].getGTtotalPoints(),*/
            //marks: props.student[1].getStudentMarks(),
            index:props.index
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
        /*const gradedTasksItems = this.state.students.map((student) =>
            <RankingListItemGradedTasksPage key={student[0]} index={cont++} student={student} />            
        );*/
        console.log('RENDER LISTITEM'+this.state.xp);
        
        return (
            <tr className="js-rowStudent" >
            <td className="w-5" id="sorting"><h3>{this.state.index}</h3></td>
            <td className="w-35">
                <img className="profile" src={'src/server/data/fotos/' + this.state.id + '.jpg'} height="60" width="48"/>
                <a className="text-info" href={'#student/'+this.state.id}> {this.state.student.surname}, {this.state.student.name}</a>
            </td>
            <td className="w-60">
              <table id="scoreTable" className="table-condensed" width="100%">
               <tbody>
                <tr> 
                    <td className="w-20">        
                        <strong>{this.state.student.getFinalGrade()}</strong>
                    </td>
                    <td className="w-20">
                        {this.state.student.getXPtotalPoints()}
                    </td>
                    <td className="w-20">
                        {this.state.student.getGTtotalPoints()}
                    </td>
                    <td className="w-40 text-right">
                        <a href={'#addXP/'+this.state.id}><button className="btnS btn btn-primary">+XP</button></a>
                            
                        <a href={'#editStudent/'+this.state.id}>
                       <button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'></i></button></a>
                
                       <a href={'#deleteStudent/'+this.state.id}>
                       <button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i></button></a>
                        
                    </td>                    
                </tr> 
                <RankingListItemGradedTasksPage marks={this.state.student.getStudentMarks()} /> 
               </tbody> 
             </table>  
            </td>             
        </tr>
            
            
        );
    }
}

export default RankingListItemPage;
