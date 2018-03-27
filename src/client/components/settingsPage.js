import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import T from 'i18n-react';
import Settings from '../classes/settings.js';
import { gtaLangs } from '../lib/languages.js';

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
            shareGroup:props.props.shareGroup,            
            traductions: T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json')),
            gtaLangs: ''
        };    
        
        this.handleSubmitNewTerm = this.handleSubmitNewTerm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);    
    }
    
    handleInputChange(event) {
        const target = event.target;        
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        const id = target.id;
        let newTerms = [];

        if (name === "weightXP") {
            //this.state.weightGP = 100 - value;
            this.state.weightGP = 100;
        }else if (name === "termName" || name === "termBegin" || name === "termEnd") {
            newTerms=this.state.terms.map((term) => {
                if (term.name === id) {
                    return {"name":(name === "termName")?value:term.name,"begin":(name === "termBegin")?value:term.begin,"end":(name === "termEnd")?value:term.end}
                }else{
                    return term;
                }
            });
            name = "terms";
            value = newTerms;    
        }
        
        console.log(value);
        this.setState({  [name]: value }, () => this.SendChanges(name));    
    }

    SendChanges(name='') {        
        events.publish('dataservice/saveSettings',this.state);
        events.publish('settings/change',this.state);
        events.publish('settings/saveSettings',this.state);
        
        if (name === "language") {
            this.setState({
                traductions: T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
            });
            events.publish('language/change', this.state.traductions);  
        }        
    }
   

    handleSubmitNewTerm(event) {
        event.preventDefault();
        const target = event.target;
        const term = event.target.newTerm.value;
        const begin = event.target.newBeginTerm.value;
        const end = event.target.newEndTerm.value;      
                
        let newTerm ={'name':term,'begin':begin,'end':end};
        let prova = this.state.terms;
        prova.push(newTerm);
        
        if (term) {
            this.setState({
                'terms':prova
            });
        
            this.SendChanges();
        }
    }

    render() {
        let index = -1;
        const gtaLangsItems = Object.entries(gtaLangs).map(([key, value]) =>
            <option key={index++} value={value}>{value}</option>
        );
        return (            
            <div>
            <h3>{T.translate("settingsTitle")}</h3>

            <div className="row">
                <div className="form-group col-sm-4">
                    Share group:
                    <div className="onoffswitch">
                    
                        <input id="myonoffswitch"  className="onoffswitch-checkbox" type="checkbox" defaultChecked={this.state.shareGroup} name='shareGroup' onClick={this.handleInputChange} />               
                        <label className="onoffswitch-label" htmlFor="myonoffswitch">
                        
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>                    
                        </label>                
                    </div>
                </div>
                <div className="form-group col-sm-4">
                    <label htmlFor="xp" id="idXPweight">{T.translate("settingsLblXP")} {this.state.weightXP}%</label><br/>
                    <input type="range" min="0" max="100" defaultValue={this.state.weightXP} onInput={this.handleInputChange} id="weightChanger" name='weightXP' /><br/>
                    {/*<label htmlFor="gt" id="idGPweight">{T.translate("settingsLblGT")} {this.state.weightGP}%</label>*/}
                </div>
                
                <div className="col-sm-4">
                    <span>{T.translate("settingsLblCode")}:</span>
                    <h1>{this.state.code}</h1>
                </div>
            </div>
            {T.translate("settingsLblDefaultTerm")}:
              <div className="form-group">
              
                  <select name="defaultTerm" id="termsItems" onChange={this.handleInputChange} defaultValue={this.state.defaultTerm}>
                  {this.state.terms.map((term, i) =>
                        <option key={i} value={term.name}>{term.name}</option>
                    )}  
                    <option value="ALL">ALL</option> 
                  </select>   
                  
                 {this.state.terms.map((term, i) => 
                   
                    <div key={'formGroup'+i} className="form-group row">
                         <label className="col-sm-2 col-form-label" htmlFor="xp" id={"id"+term.name}>Term Name:</label><br/>
                         <input name="termName" className="form-control col-sm-2" id={term.name} type="text" value={term.name} onChange={this.handleInputChange} />
                         <label className="col-sm-2 col-form-label">BEGIN</label> <input name="termBegin" className="form-control col-sm-2" id={term.name} type="date" value={term.begin} onChange={this.handleInputChange} />
                         <label className="col-sm-2 col-form-label">END</label> <input name="termEnd" className="form-control col-sm-2" id={term.name} type="date" value={term.end}  onChange={this.handleInputChange} />      
                        {/* <input type="submit" class="btn btn-primary" value="Change"/> */}                        
                    </div>                    
                 )} 
                 <hr/>
                 <form id="newTerm" onSubmit={this.handleSubmitNewTerm}>
                     <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="xp" id="termName">New Term</label><br/>
                        <input className="form-control col-sm-2" name="newTerm" type="text"/>
                        <label className="col-sm-2 col-form-label">BEGIN</label><input className="form-control col-sm-2" name="newBeginTerm" type="date"/>
                        <label className="col-sm-2 col-form-label">END</label><input className="form-control col-sm-2" name="newEndTerm" type="date"/>      
                        <input type="submit" className="ml-2 mt-2 btnS btn btn-primary" value="New term" />
                  </div>
                </form> 
              </div>
            
            {T.translate("settingsLblChangeSubject")}:
            <div className="form-group">
                <input className="form-control" type="text" defaultValue={this.state.defaultSubject} onInput={this.handleInputChange} id="NewNameSubject" name='NewNameSubject' /><br/>
                <a href={'#editSubject/'+ this.state.NewNameSubject} ><button className='btnS btn btn-success'><i className='fa fa-pencil fa-1x'></i> {this.state.NewNameSubject}</button></a>
                <a href={'#deleteSubject/'+ this.state.defaultSubject} ><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i> {this.state.defaultSubject}</button></a>
            </div>

            <div className="form-group">
                <label htmlFor="pLanguage"> {T.translate("settingsLblPreferredLanguage")} </label>
                <select className="form-control" name="language" defaultValue={this.state.language} onChange={this.handleInputChange}>
                    <option key="0" value="English">English</option>
                    <option key="1" value="spanishNative">Spanish</option>
                    <option key="2" value="valencianNative">Valencia</option>
                </select>
            </div>

            <div className="form-group">
                <label>Preferred other languages:</label>
                <select className="form-control" name="language" defaultValue={this.state.gtaLangs} onChange={this.handleInputChange}>
                    {gtaLangsItems}
                </select>
            </div>

          </div>    

        );
    }
}

export default SettingsPage;
