import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import AttitudeListItemPage from './attitudeListItemPage.js';
import GradedTaskListItemPage from './gradedTaskListItemPage.js';


class PersonDetailPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            student:props.student.personInstance,
            currentTerm: props.defaultTerm, 
            terms:props.terms,
            readOnly:props.readOnly ? true : false         
        };      
    }
    
    render() {      
        
        const attitudeTasksItems = this.state.terms.map((term) => {
            
            let attByTerm=[];
            this.state.student.attitudeTasks.sort(function(a,b){ b.timestamp > a.timestamp }).map((att) => {
                let target = new Date(att.timestamp).getTime();
                let begin = new Date(term.begin).getTime();
                let end = new Date(term.end).getTime();
                
                if (target>=begin && target <=end) {
                    attByTerm.push([this.state.student.getAttitudeById(att.id),att.timestamp]);
                }
            });
   
            return <AttitudeListItemPage key={term.name} readOnly={this.state.readOnly} show={term.name==this.state.currentTerm?true:false} term={term.name} studentId={this.state.student.id} attitudeInstances={attByTerm} />                                
           
        });

        /*const attitudeTasksItems = this.state.student.attitudeTasks.reverse().map((attitudeItem) =>
            <AttitudeListItemPage key={attitudeItem.id+attitudeItem.timestamp} readOnly={this.state.readOnly} studentId={this.state.student.id} datetime={attitudeItem.timestamp} attitudeInstance={this.state.student.getAttitudeById(attitudeItem.id)} />                                
        );*/
        
        const gradedTasksItems =  this.state.student.getGradedTasks().map((gtItem) =>
            <GradedTaskListItemPage key={gtItem[0]} studentId={this.state.student.id} gradedTaskInstance={gtItem[1]} />                                
        );
       
        return (
            
            <div className="row">
                <div className="col-sm-3">
                    <div className="card bg-light">
                        <img className="card-img-top" src={'src/server/data/fotos/'+this.state.student.id+'.jpg'}  alt={this.state.student.name + ' ,'+ this.state.student.surname} />
                        <div className="card-body">
                            <h5 className="card-title">{this.state.student.name} {this.state.student.surname}</h5>
                            <p className="card-text">{this.state.student.email} Final Grade = {this.state.student.getFinalGrade()}</p>
                            {!this.state.readOnly ? <a href={'#editStudent/'+this.state.student.id}><button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'> Edit </i></button></a> : null}
                        </div>
                    </div>
                 </div>

                 <div id="accordion" className="col-sm-5">                     
                    {attitudeTasksItems}                 
                </div>

                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-header">
                            Graded tasks
                        </div>
                        <div className="card-body">
                            <h5 className="card-title"></h5>
                            <ul className="list-group list-group-flush">                
                                {gradedTasksItems}
                            </ul>
                            
                            {/* <a href="#" class="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>                
                </div>
            </div>
        );
    }
}

export default PersonDetailPage;