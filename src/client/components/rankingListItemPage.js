import React from 'react';
//import {events} from '../lib/eventsPubSubs.js';
import RankingListItemGradedTasksPage from './rankingListItemGradedTasksPage.js';

class RankingListItemPage extends React.Component {
    constructor(props){

        console.log(props.selectedAll);

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
       this.setState({selected:props.selected});       
    }

    handleCheckedChild (event) {
        event.preventDefault();
        if(this.state.selected==true){
            this.setState({selected:false});
            this.props.updateSelectedListFromParent({'option':'delete','id':this.state.id});
        }else{
            this.setState({selected:true});
            this.props.updateSelectedListFromParent({'option':'add','id':this.state.id});
        }
    }

    
    
    render() {
        let index=0;
        const studentsGT = this.state.student.getStudentMarks().map((studentgt) =>
            <RankingListItemGradedTasksPage key={studentgt.id+studentgt.idStudent} studentgt={studentgt} idstudent={studentgt.idStudent} readOnly={this.state.readOnly}/>            
            
        );
        return (
        <tr className="d-flex js-rowStudent align-items-center" >
            <td className="col-1" id="sorting">
                <h3> 
                    {!this.state.readOnly ? <input id={"check"+this.state.id} checked={this.state.selected} type="checkbox" onChange={this.handleCheckedChild}  />:null}&nbsp;{this.state.index}</h3>
            </td>
            
            <td className="col-8" colSpan="3">
                <div  className="row">
                    <div className="col-sm-2 vertical-center"><a href={'#student/'+this.state.id}><img className="profile" src={'src/server/data/fotos/' + this.state.id + '.jpg#' + new Date().getTime()} height="60" width="48"/></a></div>
                    <div className="tdStudentLink col-sm-4 vertical-center">
                                <label htmlFor="surnames" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.surname}</a>
                                </label>
                                <input id="surnamesInput" type="text" className="edit-input" idstudent={this.state.id} required/>
                    </div>
                    <div className="tdStudentLink col-sm-3 vertical-center">
                            <label htmlFor="name" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.name}</a>
                                </label>
                                <input id="nameInput" type="text" className="edit-input" idstudent={this.state.id} required/>
                    </div>
                    <div className="tdStudentLink col-sm-3 vertical-center ">
                            <label htmlFor="email" className="control-label d-none d-md-block">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.email}</a>
                                </label>
                                <input id="emailInput" type="text" className="edit-input" idstudent={this.state.id} required />
                    </div> 
                 </div>   
                
                    <div className="tableGradedTasks border border-top border-secondary rounded p-2 mt-3"  style={{display:'none'}}>   
                        {studentsGT}  
                    </div>                      
                  
            </td>
            <td className="col-3">
                <div className="row align-items-center"> 
                    <div className="col-sm-3">        
                        <strong>{this.state.student.getFinalGrade()}</strong>
                    </div>
                    <div className="col-sm-3">
                        {this.state.student.getXPtotalPoints()}
                    </div>
                    <div className="col-sm-2">
                        {this.state.student.getGTtotalPoints()}
                    </div>
                    <div className="col-sm-1">
                        {!this.state.readOnly ? <a href={'#addXP/'+this.state.id}><button className="btnS btn btn-success">+XP</button></a> : null}
                        {/*{!this.state.readOnly ? <a href={'#editStudent/'+this.state.id}><button className='btnS btn btn-success'>&nbsp;<i className='fa fa-pencil fa-1x'></i></button></a> : null}
                        {!this.state.readOnly ? <a href={'#deleteStudent/'+this.state.id}><button className='btnS btn btn-danger'>&nbsp;<i className='fa fa-trash-o fa-1x'></i></button></a> : null}*/}
                    </div>                    
                </div>
               
            </td>             
        </tr>
            
            
        );
    }
}

export default RankingListItemPage;
