import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import T from 'i18n-react';
import Settings from '../classes/settings.js';

class GradedTaskPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {                
                name: props.props.name,
                description: props.props.description,
                weight:props.props.weight,
                term:props.props.term,
                terms:props.terms,
                id:props.props.id,         
                allowedWeight:props.allowedWeight
        }               
      
        T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);   

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        events.publish('dataservice/SaveGradedTask',this.state);        
    }

    render() {
        let termsElements = this.state.terms.map((termEl) => 
            <option key={termEl.name} value={termEl.name}>{termEl.name}</option>
        );
        
        return (
            <div>
            <h3>{T.translate("addGradedTaskTitle")}</h3>  
            <p>{T.translate("addGradedTaskSubtitle")}</p>
            <form id="newGradedTask" onSubmit={this.handleSubmit}>
                <div className="form-group">   
                    <label htmlFor="name">{T.translate("addGradedTaskLblName")}:</label>
                    <input type="text" className="form-control" id="idTaskName" name="name" value={this.state.name} onChange={this.handleInputChange} required/>  

                </div>
                
                <div className="form-group">   
                    <label htmlFor="description">{T.translate("addGradedTaskLblDescription")}:</label>
                    <textarea rows="4" cols="50" className="form-control" id="idTaskDescription" name="description" defaultValue={this.state.description} onChange={this.handleInputChange}></textarea>
                </div>
                <div className="form-group">   
                    <label htmlFor="term">{T.translate("addGradedTaskLblTerm")}:</label>
                    <select id="termTask" name="term" value={this.state.term || '1st Term'} onChange={this.handleInputChange}>
                        {termsElements}
                  </select>
                </div>

                <div className="form-group">   
                    <label id="labelWeight" htmlFor="weight">{T.translate("addGradedTaskLblWeight")} (0-{this.state.allowedWeight} %):</label>
                    <input type="number" name="weight" className="form-control" min="1" max ={this.state.allowedWeight} id="idTaskWeight" defaultValue={this.state.weight} onChange={this.handleInputChange} required/>
                </div>
                <input type="submit" className="btn btn-primary" value={T.translate("addGradedTaskInputSave")}/>
            </form> 

            </div>
            
            
        );
    }
}

export default GradedTaskPage;
