import React from 'react';
import reactDOM from 'react-dom';
import {events} from '../lib/eventsPubSubs.js';
//import NewSubjectPage from './newSubjectPage.js';
import SubjectModalPage from './subjectModalPage.js'; 
import T from 'i18n-react';
import Settings from '../classes/settings.js';

class MenuPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {                
            displayName: props.props.displayName,
            subjects: props.props.subjects,
            defaultSubject: props.props.defaultSubject,
            defaultTerm: props.props.defaultTerm,
            sharedGroups: props.props.sharedGroups,
            traductions: T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json')),
            readOnly:props.readOnly ? true : false
        };
        console.log('menuuu');  
        console.log(Settings.getLanguage());
        
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    componentDidMount() {
        this.setState({
            traductions:T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
        });
        this.subscription = events.subscribe('settings/change',(obj) => {  
            this.setState({
                traductions:T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
            });               
        });      
    }
    componentWillUnmount() {
        this.subscription.remove();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;   
        
        if (value === 'NEW SUBJECT') {            
            reactDOM.unmountComponentAtNode(document.getElementById('modals'));
            reactDOM.render(<SubjectModalPage  key={new Date()} sharedGroups={this.state.sharedGroups}/>, document.getElementById('modals'));    
        }else {
            this.setState({  
                [name]: value 
            },() => { events.publish('menu/changesubject',this.state)});           
        }       
    }     

    render() {
       
        return (          
                                
                    <ul  className="navbar-nav ml-auto">
                      
                        <li className="nav-item">
                        <div className="input-group">
                           
                         {!this.state.readOnly ? <select className="form-control form-control-sm mt-sm-2 mr-sm-2" ref={(node) => this.select = node} name="defaultSubject" value={this.state.defaultSubject} id="subjectsItems" onChange={this.handleInputChange}>
                                            {this.state.subjects.map((sub, i) =>
                                            <option key={i} value={sub}>{sub}</option>
                                            )}
                                            <option name="new subject" value="NEW SUBJECT">{T.translate("menuOptionNewSubject")}</option>
                                        </select> : null}  
                           
                        </div>
                        </li>
                      <li className="nav-item">
                            {!this.state.readOnly ? <a className="nav-link" href="#addStudent">
                               <button className="btn btn-secondary" data-toggle="tooltip" data-placement="top" title={T.translate("menuTitleAddStudent")}> <i className="fa fa-user"></i> </button>
                            </a> : null}
                            
                        </li>
                        <li className="nav-item">
                        {!this.state.readOnly ? <a className="nav-link" href="#addGradedTask">
                                 <button className="btn btn-secondary" data-toggle="tooltip" data-placement="top" title={T.translate("menuTitleAddGradedTask")}><i className="fa fa-tasks"></i></button>
                            </a> : null}
                            
                        </li>
                        <li className="nav-item">
                        {!this.state.readOnly ? <a className="nav-link" href="#settings">
                                <button className="btn btn-secondary" data-toggle="tooltip" data-placement="top" title={T.translate("menuTitleSettings")}><i className="fa fa-cogs"></i></button>
                            </a>: null}

                        </li>
                        
                        <li className="nav-item">
                        {!this.state.readOnly ? <a className="nav-link" href="#logout">
                              <button className="btn btn-danger" data-toggle="tooltip" data-placement="top" title={T.translate("menuTitleLogout")}><i className="fa fa-sign-out"></i></button>
                            </a>: <a className="nav-link" href="#logout">
                              <button className="btn btn-danger" data-toggle="tooltip" data-placement="top" title={T.translate("menuTitleLogout")}><i className="fa fa-sign-out"></i></button>
                            </a>}

                        </li>
                    </ul> 
                                           
                
        );
    }
}

export default MenuPage;
