import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import { translate } from '../lib/i18n/translation.js';

class SettingsPage extends React.Component {
    constructor(props){
        super(props);        
        this.state = {                
            weightGP:props.props.weightGP,
            weightXP:props.props.weightXP,
            terms: props.props.terms,
            defaultTerm: props.props.defaultTerm,
            defaultSubject: props.defaultSubject,
            NewNameSubject: props.defaultSubject,                            
            language: props.props.language
        };        
                   
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
          });
        if (name === "weightXP"){
            this.state.weightGP = 100 - value;
        }
        console.log(this.state);
        this.setState({  [name]: value }, () => this.SendChanges(name));    
    }

    SendChanges(name){
        if (name === "weightXP" || name === "defaultTerm" || name === "language"){
            events.publish('dataservice/saveSettings',this.state);
            events.publish('settings/change',this.state);
            events.publish('settings/saveSettings',this.state);
            
        } else { console.log("OK") }
    }
   

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.points)
        let data = [this.state.points, this.state.text, this.state.students ]
        events.publish('attitudeTask/addNewAT', data);
        $('#XPModal').modal('toggle');
        $('.modal-backdrop').remove();
    }

    render() {        
        return (            
            <div>
            <h3>Settings</h3>
            <form id="newSettings">
              <div className="form-group">
                <label htmlFor="xp" id="idXPweight">Weight XP {this.state.weightXP}%</label><br/>
                <input type="range" min="0" max="100" defaultValue={this.state.weightXP} onInput={this.handleInputChange} id="weightChanger" name='weightXP' /><br/>
                <label htmlFor="gt" id="idGPweight">Weight GT {this.state.weightGP}%</label>
              </div>
            </form> 
            
            <form id="existingTerms">
              DEFAULT TERM:
              <div className="form-group">
              
                  <select name="defaultTerm" id="termsItems" onChange={this.handleInputChange} defaultValue={this.state.defaultTerm}>
                  {this.state.terms.map((term, i) =>
                        <option key={i} value={term.name}>{term.name}</option>
                    )}  
                    <option value="ALL">ALL</option> 
                  </select>   
            
              </div>
            </form> 
              CHANGE SUBJECT:
            <div className="form-group">
                <input type="text" defaultValue={this.state.defaultSubject} onInput={this.handleInputChange} id="NewNameSubject" name='NewNameSubject' /><br/><br/>
                <a href={'#editSubject/'+ this.state.NewNameSubject} ><button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'></i> {this.state.NewNameSubject}</button></a>
                <a href={'#deleteSubject/'+ this.state.defaultSubject} ><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i> {this.state.defaultSubject}</button></a>
            </div>

            <div className="form-group">
                <label htmlFor="pLanguage"> Preferred language </label>
                <select name="language" defaultValue={this.state.language} onChange={this.handleInputChange}>
                    <option key="0" value="en">English</option>
                    <option key="1" value="es">Spanish</option>
                    <option key="2" value="val">Valencia</option>
                </select>
            </div>

          </div>    

        );
    }
}

export default SettingsPage;
