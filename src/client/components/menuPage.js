import React from 'react';
import reactDOM from 'react-dom';
import {events} from '../lib/eventsPubSubs.js';
//import NewSubjectPage from './newSubjectPage.js';
import SubjectModalPage from './subjectModalPage.js'; 

class MenuPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {                
            displayName: props.props.displayName,
            subjects: props.props.subjects,
            defaultSubject: props.props.defaultSubject,
            defaultTerm: props.props.defaultTerm,
            sharedGroups: props.props.sharedGroups
        };  
        this.handleInputChange = this.handleInputChange.bind(this); 
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
            //debugger;
            //events.publish('menu/changesubject',this.state);
        }
        //, () => this.changesubject(value));
    }
    
   /* changesubject(value) {
        if (value === 'NEW SUBJECT') {            
            reactDOM.unmountComponentAtNode(document.getElementById('modals'));
            reactDOM.render(<SubjectModalPage  key={new Date()} sharedGroups={this.state.sharedGroups}/>, document.getElementById('modals'));    
        }else {
            events.publish('menu/changesubject',this.state);
        }
    }*/

    render() {
       
        return (
        
                <div className="collapse navbar-collapse" id="navbarNav" >
                    <table>
                        <tbody>
                        <tr><td> 
                    {this.state.displayName}&nbsp;
                    </td></tr>
                    <tr><td>
                     <select name="defaultSubject" value={this.state.defaultSubject} id="subjectsItems" onChange={this.handleInputChange}>
                                {this.state.subjects.map((sub, i) =>
                                    <option key={i} value={sub}>{sub}</option>
                                )}
                                <option name="new subject" defaultValue="NEW subject">NEW SUBJECT</option>
                            </select>
                    </td></tr>
                    <tr><td>      
                            <span id="termMenu">{this.state.defaultTerm} </span> &nbsp;   
                     </td></tr>
                     </tbody>
                     </table>      
                    <ul id="menuButtons" className="nav navbar-nav navbar-right">
                        
                        <li className="nav-item">
                            <a className="nav-link" href="#addStudent">
                                <button className="btn btn-secondary"> + Students </button>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#addGradedTask">
                                <button className="btn btn-secondary"> + Graded task</button>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#settings">
                                <button className="btn btn-secondary">Settings</button>
                            </a>
                        </li>
                        
                        <li className="nav-item">
                            <a className="nav-link" href="#logout">
                                <button className="btn btn-danger"> LOGOUT</button>
                            </a>
                        </li>
                    </ul>
                </div>
            
        );
    }
}

export default MenuPage;
