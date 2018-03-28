import React from 'react';
//import {events} from '../lib/eventsPubSubs.js';
import RankingListItemGradedTasksPage from './rankingListItemGradedTasksPage.js';

class RankingListItemPage extends React.Component {
    constructor(props){

        //console.log("SELECTED ALL ="+props.selectedAll);

        super(props);
        this.state = {                
            id:props.student[0],         
            student:props.student[1],  
            readOnly:props.readOnly,
            studentIndex:props.student,        
            index:props.index,
            selected:props.selected
            
        }; 
        this.handleCheckedChild=this.handleCheckedChild.bind(this);
    }    

    componentWillReceiveProps(props) {      
       //debugger;
       this.setState({selected:props.selected});       
    }

    handleCheckedChild (event) {
        //event.preventDefault();
        if(this.state.selected==true){
            this.setState({selected:false});
            this.props.updateSelectedListFromParent({'option':'delete','id':this.state.id});
        }else{
            this.setState({selected:true});
            this.props.updateSelectedListFromParent({'option':'add','id':this.state.id});
        }
    }

    
    
    render() {        
        //console.log("RENDE ListItemPage");
        const studentsGT = this.state.student.getStudentMarks().map((studentgt) =>
            <RankingListItemGradedTasksPage key={studentgt.id+studentgt.idStudent} studentgt={studentgt} idstudent={studentgt.idStudent} readOnly={this.state.readOnly}/>            
            
        );
        return (
        <tr className="d-flex js-rowStudent align-items-center" >
            <td className="col-2" id="sorting">
                <h3> 
                    {!this.state.readOnly ? <input id={"check"+this.state.id} checked={this.state.selected} type="checkbox" onChange={this.handleCheckedChild}  />:null}&nbsp;{this.state.index}</h3>
            </td>
            
            <td className="col-6" colSpan="2">
                <div  className="row">
                    <div className="col-sm-2 vertical-center"><a href={'#student/'+this.state.id}><img className="profile" src={'src/server/data/fotos/' + this.state.id + '.jpg#' + new Date().getTime()} height="60" width="48"/></a></div>
                    <div className="tdStudentLink col-sm-5 vertical-center">
                                <label htmlFor="surnames" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.surname}</a>
                                </label>
                                <input id="surnamesInput" type="text" className="edit-input" idstudent={this.state.id} required/>
                    </div>
                    <div className="tdStudentLink col-sm-5 vertical-center">
                            <label htmlFor="name" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.name}</a>
                                </label>
                                <input id="nameInput" type="text" className="edit-input" idstudent={this.state.id} required/>
                    </div>
                   
                 </div>   
                
                    <div className="tableGradedTasks border border-top border-secondary rounded p-2 mt-3"  style={{display:'none'}}>   
                        {studentsGT}  
                    </div>                      
                  
            </td>
            <td className="col-4">
                <div className="row align-items-center"> 
                    <div className="col-sm">        
                        {this.state.student.getFinalGrade()<=50?
                            <button type="button" className="btn btn-danger">
                                <span className="badge badge-light">{this.state.student.getFinalGrade()}</span> FG
                            </button>:
                            <button type="button" className="btn btn-success">
                                <span className="badge badge-light">{this.state.student.getFinalGrade()}</span> FG
                            </button>
                        }
                    </div>
                    <div className="col-sm">
                        {!this.state.readOnly ? <a href={'#addXP/'+this.state.id}>
                            <button type="button" className="btn btn-warning btn-sm">
                                <span className="badge badge-light">{this.state.student.getXPtotalPoints()}</span> XP
                            </button></a>:
                            <button type="button" className="btn btn-warning btn-sm">
                            <span className="badge badge-light">{this.state.student.getXPtotalPoints()}</span> XP
                        </button>}
                        
                    </div>
                    <div className="col-sm">

                        <button type="button" className="btn btn-info btn-sm">
                            <span className="badge badge-light">{this.state.student.getGTtotalPoints()}</span> GT
                        </button>
                        
                    </div>
                    {/*<div className="col-sm-1">
                        {!this.state.readOnly ? <a href={'#addXP/'+this.state.id}><button className="btnS btn btn-success">+XP</button></a> : null}
                       
                    </div>*/}                    
                </div>
               
            </td>             
        </tr>
            
            
        );
    }
}

export default RankingListItemPage;
