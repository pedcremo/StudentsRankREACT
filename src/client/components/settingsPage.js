import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class SettingsPage extends React.Component {
    constructor(props){
        super(props);        
        this.state = {                
            weightGP:props.props.weightGP,
            weightXP:props.props.weightXP,
            terms: props.props.terms,
            defaultTerm: props.props.defaultTerm,
            defaultSubject: props.defaultSubject
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
        if (name === "weightXP" || name === "defaultTerm"){
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
              <a href={'#deleteSubject/'+ this.state.defaultSubject} ><button className='btnS btn btn-danger'><i className='fa fa-trash-o fa-1x'></i> {this.state.defaultSubject}</button></a>
              {/*      
              {this.state.terms.map((term, i) =>
                    <div key={'formGroup'+i} className="form-group">
                        <label htmlFor="xp" id={"id"+term.name}>Term Name:</label><br/>
                        <input id={"idInput"+term.name} type="text" value={term.name}/>
                        BEGIN<input id={term.name+"beginTerm"} type="date" value={term.begin}/>
                        END<input id={term.name+"endTerm"} type="date" value={term.end}/>      
                        <input type="submit" className="btn btn-primary" value="Change"/>
                     </div>
                )} */}
              
            </form> 
            {/*
            <form id="newTerm">
                <div className="form-group">
                  <label htmlFor="xp" id="termName">Term name</label><br/>
                  <input id="nameTerm" type="text"/>
                  BEGIN<input id="beginTerm" type="date"/>
                  END<input id="endTerm" type="date"/>      
                  <input type="submit" className="btn btn-primary" value="New term" />
                </div>
            </form> */}
          </div>    

        );
    }
}

export default SettingsPage;
