import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import AttitudeListItemPage from './attitudeListItemPage.js';
import GradedTaskListItemPage from './gradedTaskListItemPage.js';


class PersonDetailPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            student:props.student.personInstance,
            readOnly:props.readOnly ? true : false         
        };        
       
    }
    
    render() {      
       
        const attitudeTasksItems = this.state.student.attitudeTasks.reverse().map((attitudeItem) =>
            <AttitudeListItemPage key={attitudeItem.id+attitudeItem.timestamp} readOnly={this.state.readOnly} studentId={this.state.student.id} datetime={attitudeItem.timestamp} attitudeInstance={this.state.student.getAttitudeById(attitudeItem.id)} />                                
        );
        
        const gradedTasksItems =  this.state.student.getGradedTasks().map((gtItem) =>
            <GradedTaskListItemPage key={gtItem[0]} studentId={this.state.student.id} gradedTaskInstance={gtItem[1]} />                                
        );
       
        return (
            
            <div className="row">
                <div className="col-sm">
                    <div className="card">
                        <img className="card-img-top" src={'src/server/data/fotos/'+this.state.student.id+'.jpg'}  alt={this.state.student.name + ' ,'+ this.state.student.surname} />
                        <div className="card-body">
                            <h5 className="card-title">{this.state.student.name} {this.state.student.surname}</h5>
                            <p className="card-text">{this.state.student.email} Final Grade = {this.state.student.getFinalGrade()}</p>
                            {!this.state.readOnly ? <a href={'#editStudent/'+this.state.student.id}><button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'> Edit </i></button></a> : null}
                        </div>
                    </div>
                 </div>
                 <div className="col-sm"> 
                    <div class="card">
                        <div class="card-header">
                            Attitude tasks
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"></h5>
                            
                            <ul className="list-group list-group-flush">                
                                {attitudeTasksItems}                
                            </ul>
                           
                    
                    <div id="accordion">

                        <div className="card">
                            <div className="card-header">
                            <a className="card-link" data-toggle="collapse" href="#collapseOne">
                                Term #1
                            </a>
                            </div>
                            <div id="collapseOne" className="collapse show" data-parent="#accordion">
                            <div className="card-body">
                                Content
                            </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                            <a className="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
                                Term #2
                            </a>
                            </div>
                            <div id="collapseTwo" className="collapse" data-parent="#accordion">
                            <div className="card-body">
                                Lorem ipsum..
                            </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                            <a className="collapsed card-link" data-toggle="collapse" href="#collapseThree">
                               Term #3
                            </a>
                            </div>
                            <div id="collapseThree" className="collapse" data-parent="#accordion">
                            <div className="card-body">
                                Lorem ipsum..
                            </div>
                            </div>
                        </div>

                        </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm">
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