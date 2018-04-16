import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import {formatDate} from '../lib/utils.js';

class GradedTaskListItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {   
            term:props.term,
            studentId:props.studentId,            
            gtItems:props.gradedTaskInstances,
            show:props.show               
        };          
    }
    
    render() {

        const gtByTerm = this.state.gtItems.map((gtItem) => 
            <li className="list-group-item" key={gtItem.id}><span className={"badge "+ (gtItem.getStudentMark(this.state.studentId)>=50?'badge-success':'badge-danger')}>{gtItem.getStudentMark(this.state.studentId)} </span>{' doing '+ gtItem.name + '('+gtItem.weight+'%) on ' + formatDate(new Date(gtItem.datetime))}</li>           
         );
    
        return ( 
        <div className="card">
                <div className="card-header">
                    <a className="card-link" data-toggle="collapse" href={'#collapseTWO'+this.state.term.split(' ').join('_')}>
                        Graded tasks {this.state.term}
                    </a>
                </div>
                <div id={'collapseTWO'+this.state.term.split(' ').join('_')} className={'collapse'+ (this.state.show?' show':'')} data-parent="#accordion2">
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            {gtByTerm}
                        </ul>                
                    </div>
                </div>
            </div>       
                
    )
    }
}

export default GradedTaskListItemPage;