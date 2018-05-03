import React from 'react';
import RankingListItemGradedTasksPage from './rankingListItemGradedTasksPage.js';
import Settings from '../../classes/settings.js';
import T from 'i18n-react'

class RankingListItemPage extends React.Component {
    constructor(props) {       

        super(props);
        this.state = {                
            id:props.student[0],       
            settings:props.settings,  
            student:props.student[1],  
            readOnly:props.readOnly,
            studentIndex:props.student,        
            index:props.index,
            selected:props.selected
            
        }; 
        T.setTexts(require('../../lib/i18n/' + Settings.getLanguage() + '.json'));
        this.handleCheckedChild=this.handleCheckedChild.bind(this);
        this.handleGradedTaskExpandedView = this.handleGradedTaskExpandedView.bind(this);
    }    

    componentWillReceiveProps(props) {             
       this.setState({selected:props.selected});       
    }

    handleGradedTaskExpandedView(event) {             
        $('.tableGradedTasks').toggle();              
        if ($('.tableGradedTasks').is(':visible')) {       
          $('.fa-hand-o-right').addClass('fa-hand-o-down').removeClass('fa-hand-o-right');
          setCookie('expandedView','true',12);
        }else {     
          $('.fa-hand-o-down').addClass('fa-hand-o-right').removeClass('fa-hand-o-down');    
          setCookie('expandedView','false',12);    
        }
    }

    handleCheckedChild (event) {        
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
                    <div className="col-sm-2 vertical-center"><a href={'#student/'+this.state.id}><img className="profile" src={'src/server/data/fotos/' + this.state.id + '.jpg#' + new Date().getTime()} height="60" width="48"/></a>{this.state.student.alerts.length>0?'ALERTA':null}</div>
                    <div className="tdStudentLink col-sm-5 vertical-center mt-3">
                                <label htmlFor="surnames" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.surname}</a>
                                </label>
                                <input id="surnamesInput" type="text" className="edit-input" idstudent={this.state.id} required/>
                    </div>
                    <div className="tdStudentLink col-sm-5 vertical-center mt-3">
                            <label htmlFor="name" className="control-label">
                                    <a className="studentLink text-info" href={'#student/'+this.state.id}>{this.state.student.name}</a>
                                </label>
                                <input id="nameInput" type="text" className="edit-input" idstudent={this.state.id} required/>
                    </div>
                   
                 </div>   
                
                    <div className="tableGradedTasks card rounded mt-2" style={{display:'none'}}>   
                        <div className="card-header">{T.translate("GradedTasks")} {this.state.settings.defaultTerm} {T.translate("term")}</div>
                        
                            {studentsGT}  
                       
                    </div>                      
                  
            </td>
            <td className="col-4">
                <div className="row align-items-center"> 
                    <div className="col-sm">        
                        
                            <button type="button" className={'btn '+ (this.state.student.getFinalGrade()<50? 'btn-danger':'btn-success')}>
                                <span className="badge badge-light">{this.state.student.getFinalGrade()}</span> FG
                            </button>
                        
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

                        <button type="button" className="btn btn-info btn-sm" onClick={this.handleGradedTaskExpandedView} >
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
