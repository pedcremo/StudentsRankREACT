import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import T from 'i18n-react';
import Settings from '../classes/settings.js';
import { gtaLangs } from '../lib/i18n/translation.js';

class SettingsPage extends React.Component {
    constructor(props){
        super(props);        
        this.state = {                
            weightGP:props.props.weightGP,
            weightXP:props.props.weightXP,
            terms: props.props.terms,
            defaultTerm: props.props.defaultTerm,
            defaultSubject: props.defaultSubject,
            code:props.code,                            
            NewNameSubject: props.defaultSubject,                            
            language: props.props.language,
            traductions: T.setTexts(Settings.getTraductedText(), { MDFlavor: 0 }),
            gtaLangs: ''
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

        this.setState({  [name]: value }, () => this.SendChanges(name));    
    }

    SendChanges(name){
        if (name === "weightXP" || name === "defaultTerm" || name === "language"){
            events.publish('dataservice/saveSettings',this.state);
            events.publish('settings/change',this.state);
            events.publish('settings/saveSettings',this.state);
            
        } else { console.log("OK") }

        this.setState({
            traductions: T.setTexts(Settings.getTraductedText(), { MDFlavor: 0 })
        });

        events.publish('language/change', this.state.traductions);  
        //this.state.traduction.setTexts(Settings.getTraductedText(), { MDFlavor: 0 })
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
        let index = -1;
        const gtaLangsItems = Object.entries(gtaLangs).map(([key, value]) =>
            <option key={index++} value={key}>{value}</option>
        );
        return (            
            <div>
            <h3>{T.translate("settingsTitle")}</h3>
            <form id="newSettings">
              <div className="form-group">
                <label htmlFor="xp" id="idXPweight">{T.translate("settingsLblXP")} {this.state.weightXP}%</label><br/>
                <input type="range" min="0" max="100" defaultValue={this.state.weightXP} onInput={this.handleInputChange} id="weightChanger" name='weightXP' /><br/>
                <label htmlFor="gt" id="idGPweight">{T.translate("settingsLblGT")} {this.state.weightGP}%</label>
              </div>
            </form> 
            <div className="col-6">
                <span>{T.translate("settingsLblCode")}:</span>
                <h1>{this.state.code}</h1>
            </div>
            <form id="existingTerms">
            {T.translate("settingsLblDefaultTerm")}:
              <div className="form-group">
              
                  <select name="defaultTerm" id="termsItems" onChange={this.handleInputChange} defaultValue={this.state.defaultTerm}>
                  {this.state.terms.map((term, i) =>
                        <option key={i} value={term.name}>{term.name}</option>
                    )}  
                    <option value="ALL">ALL</option> 
                  </select>   
            
              </div>
            </form> 
            {T.translate("settingsLblChangeSubject")}:
            <div className="form-group">
                <input type="text" defaultValue={this.state.defaultSubject} onInput={this.handleInputChange} id="NewNameSubject" name='NewNameSubject' /><br/><br/>
                <a href={'#editSubject/'+ this.state.NewNameSubject} ><button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'></i> {this.state.NewNameSubject}</button></a>
                <a href={'#deleteSubject/'+ this.state.defaultSubject} ><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i> {this.state.defaultSubject}</button></a>
            </div>

            <div className="form-group">
                <label htmlFor="pLanguage"> {T.translate("settingsLblPreferredLanguage")} </label>
                <select name="language" defaultValue={this.state.language} onChange={this.handleInputChange}>
                    <option key="0" value="en">English</option>
                    <option key="1" value="es">Spanish</option>
                    <option key="2" value="val">Valencia</option>
                </select>
            </div>

            <div className="form-group">
                <label>Preferred other languages:</label>
                <select name="gtaLangs" defaultValue={this.state.gtaLangs} onChange={this.handleInputChange}>
                    {gtaLangsItems}
                </select>
            </div>

          </div>    

        );
    }
}

export default SettingsPage;
