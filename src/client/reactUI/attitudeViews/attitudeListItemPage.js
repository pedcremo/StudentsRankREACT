import React from 'react';
import {events} from '../../lib/eventsPubSubs.js';
import {formatDate} from '../../lib/utils.js';
import Settings from '../../classes/settings.js';
import T from 'i18n-react';


class AttitudeListItemPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {   
            //datetime:props.datetime,
            term:props.term,
            studentId:props.studentId,            
            attitudeInstances:props.attitudeInstances,
            show:props.show,
            //traductions: T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json')),
            readOnly:props.readOnly             
        }; 
    }
    
    render() {
        
        const attByTerm = this.state.attitudeInstances.map((att) => {
            const alert = att[2]?<div className="alert alert-danger alert-dismissible" role="alert">
                      <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      {att[2]}
                    </div>:null;

            return <li className="list-group-item"  key={att[0].id+att[1]}> {!this.state.readOnly ?<a href={'#deleteXP/'+ this.state.studentId+'/'+att[0].id }><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i></button></a>:null} {att[0].points} points due to {att[0].description} on  {formatDate(new Date(att[1]))} {alert}</li>                                
        });
        
        return ( 
            <div className="card">
                    <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href={'#collapseOne'+this.state.term.split(' ').join('_')}>
                            {T.translate("AttitudeTasks")} {this.state.term}  {T.translate("term")}
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