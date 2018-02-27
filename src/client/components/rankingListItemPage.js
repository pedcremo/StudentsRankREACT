import React from 'react';
//import {events} from '../lib/eventsPubSubs.js';
import RankingListItemGradedTasksPage from './rankingListItemGradedTasksPage.js';

class RankingListItemPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {                
            id:props.student[0],         
            student:props.student[1],           
            index:props.index
        }; 
    }
    
    
    render() {
        let index=0;
        const studentsGT = this.state.student.getStudentMarks().map((studentgt) =>
            <RankingListItemGradedTasksPage key={studentgt.id+studentgt.idStudent} studentgt={studentgt} idstudent={studentgt.idStudent}/>            
            
        );
        return (
            <tr className="js-rowStudent" >
            <td className="w-5" id="sorting"><h3>{this.state.index}</h3></td>
            <td className="w-35">
                <table>
                    <tbody>
                        <tr>
                            <td><a href={'#student/'+this.state.id}><img className="profile" src={'src/server/data/fotos/' + this.state.id + '.jpg#' + new Date().getTime()} height="60" width="48"/></a></td>
                            <td className="tdStudentLink">
                                <label htmlFor="surnames" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.surname}</a>
                                </label>
                                <input id="edit-input" type="text" className="surnamesInput" idstudent={this.state.id} required/>
                            </td>
                            <td className="tdStudentLink">
                            <label htmlFor="name" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.name}</a>
                                </label>
                                <input id="edit-input" type="text" className="nameInput" idstudent={this.state.id} required/>
                            </td>
                            <td className="tdStudentLink">
                            <label htmlFor="email" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.email}</a>
                                </label>
                                <input id="edit-input" type="text" className="emailInput" idstudent={this.state.id} required />
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                        <a href={'#addXP/'+this.state.id}>
                        <button className="btnS btn btn-primary">+XP</button></a>
                        &nbsp;
                        <a href={'#editStudent/'+this.state.id}>
                       <button className='btnS btn btn-success'>&nbsp;<i className='fa fa-pencil fa-1x'></i></button></a>
                       &nbsp;
                       <a href={'#deleteStudent/'+this.state.id}>
                       <button className='btnS btn btn-danger'>&nbsp;<i className='fa fa-trash-o fa-1x'></i></button></a>
                        
                    </td>                    
                </tr> 
                </tbody> 
                <tbody className="tableGradedTasks" style={{display:'none'}}>                        
                    <tr>
                        {studentsGT}                        
                    </tr>
                </tbody> 
             </table>  
            </td>             
        </tr>
            
            
        );
    }
}

export default RankingListItemPage;
