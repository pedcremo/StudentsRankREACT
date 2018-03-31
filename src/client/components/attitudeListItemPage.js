import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import {formatDate} from '../lib/utils.js';

class AttitudeListItemPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {   
            //datetime:props.datetime,
            term:props.term,
            studentId:props.studentId,            
            attitudeInstances:props.attitudeInstances,
            show:props.show,
            readOnly:props.readOnly             
        }; 
    }
    
    render() {
        const attByTerm = this.state.attitudeInstances.map((att) => 
            <li className="list-group-item" key={att[0].id+att[1]}> {!this.state.readOnly ?<a href={'#deleteXP/'+ this.state.studentId+'/'+att[0].id }><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i></button></a>:null} {att[0].points} points due to {att[0].description} on  {formatDate(new Date(att[1]))} </li>                                
        );
        
        return ( 
            <div className="card">
                    <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href={'#collapseOne'+this.state.term.split(' ').join('_')}>
                            Attitude tasks {this.state.term}
                        </a>
                    </div>
                    <div id={'collapseOne'+this.state.term.split(' ').join('_')} className={'collapse'+ (this.state.show?' show':'')} data-parent="#accordion">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {attByTerm}
                            </ul>                
                        </div>
                    </div>
                </div>       
                    
        )
    }
}

export default AttitudeListItemPage;