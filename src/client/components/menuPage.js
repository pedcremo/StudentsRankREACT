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
            traductions: T.setTexts(Settings.getTraductedText(), { MDFlavor: 0 }),
            readOnly:props.readOnly ? true : false
        };  
        
        this.handleInputChange = this.handleInputChange.bind(this);

        events.subscribe('language/change',(obj) => {
            this.setState({
                traductions: obj
            });
        });
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
        
                <div className="collapse navbar-collapse" id="navbarNav" >
                    <table>
                        <tbody>
                        <tr><td className="text-center"> 
                      <span className="small">{this.state.displayName}</span>
                    </td></tr>
                    <tr><td>
                    {!this.state.readOnly ? <select ref={(node) => this.select = node} name="defaultSubject" value={this.state.defaultSubject} id="subjectsItems" onChange={this.handleInputChange}>
                        {this.state.subjects.map((sub, i) =>
                        <option key={i} value={sub}>{sub}</option>
                        )}
                        <option name="new subject" defaultValue="NEW subject">{T.translate("menuOptionNewSubject")}</option>
                    </select> : null}
                     
                    </td></tr>
                    <tr><td className="text-center">      
                            <span className="small" id="termMenu">{this.state.defaultTerm} </span> &nbsp;   
                     </td></tr>
                     </tbody>
                     </table>   
                    <ul id="menuButtons" className="nav navbar-nav navbar-right">
                        
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
                    
                </div>
            
        );
    }
}

export default MenuPage;
