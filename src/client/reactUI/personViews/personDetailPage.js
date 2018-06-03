import React from 'react';
import {events} from '../../lib/eventsPubSubs.js';
import AttitudeListItemPage from '../attitudeViews/attitudeListItemPage.js';
import GradedTaskListItemPage from '../gradedViews/gradedTaskListItemPage.js';
import Settings from '../../classes/settings.js';
import T from 'i18n-react';

class PersonDetailPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            student:props.student.personInstance,
            currentTerm: props.defaultTerm, 
            terms:props.terms,
            readOnly:props.readOnly ? true : false         
        };      
        T.setTexts(require('../../lib/i18n/' + Settings.getLanguage() + '.json'));
    }
    
    render() {      
        
        const attitudeTasksItems = this.state.terms.map((term) => {
            
            let attByTerm=[];
            let debugArray = this.state.student;
           
            this.state.student.attitudeTasks.sort(function(a,b){ b.timestamp > a.timestamp }).map((att) => {
                let target = new Date(att.timestamp).getTime();
                let begin = new Date(term.begin).getTime();
                let end = new Date(term.end).getTime();
                
                if (term.id==att.term ) {
                    if (target>=begin && target <=end) {
                        attByTerm.push([this.state.student.getAttitudeById(att.id),att.timestamp]);
                    }else {
                        attByTerm.push([this.state.student.getAttitudeById(att.id),att.timestamp,"Possible cifuentazo: XP assignada fora de dates de l'avaluació"]);
                    }
                }
            });            
            return <AttitudeListItemPage key={term.name} readOnly={this.state.readOnly} show={term.id==this.state.currentTerm?true:false} term={term.name} studentId={this.state.student.id} attitudeInstances={attByTerm} />                                
           
        });

        const gradedTasksItems=this.state.terms.map((term) => {
            let gtByTerm=[];
            this.state.student.getGradedTasks().map((gtItem) => {
                
                
                if (gtItem[1].term == term.id) {
                    gtByTerm.push(gtItem[1]);
                }
            });
            return <GradedTaskListItemPage key={term.name+'gt'} show={term.id==this.state.currentTerm?true:false} studentId={this.state.student.id} term={term.name} gradedTaskInstances={gtByTerm} />
        });
       
        return (
            
            <div className="row">
                <div className="col-sm-3">
                    <div className="card bg-light">
                        <img className="card-img-top" src={'src/server/data/fotos/'+this.state.student.id+'.jpg'}  alt={this.state.student.name + ' ,'+ this.state.student.surname} />
                        <div className="card-body">
                            <h5 className="card-title">{this.state.student.name} {this.state.student.surname}</h5>
                            <p className="card-text">{this.state.student.email} {T.translate("FinalGrade")} = {this.state.student.getFinalGrade()}</p>
                            {!this.state.readOnly ? <a href={'#editStudent/'+this.state.student.id}><button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'> {T.translate("edit")} </i></button></a> : null}
                        </div>
                    </div>
                 </div>

                 <div id="accordion" className="col-sm-5">                     
                    {attitudeTasksItems}                 
                </div>
                <div id="accordion2" className="col-sm-4">                     
                    {gradedTasksItems}                 
                </div>

                {/*<div className="col-sm-4">
                    <div className="card">
                        <div className="card-header">
                            Graded tasks
                        </div>
                        <div className="card-body">
                            <h5 className="card-title"></h5>
                            <ul className="list-group list-group-flush">                
                                {gradedTasksItems}
                            </ul>
                            
                            
                        </div>
                    </div>               
                </div> */}   
            </div>
        );
    }
}

export default PersonDetailPage;