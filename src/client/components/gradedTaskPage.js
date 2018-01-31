import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class GradedTaskPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {                
                name: props.props.name,
                description: props.props.description,
                weight:props.props.weight,
                term:props.props.term,
                id:props.props.id,         
                allowedWeight:props.allowedWeight
        }        
        
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
        return (
            <div>
            <h3>Add new Graded Task REACT COMPONENT</h3>  
            We understand as a graded task any test or practice that will be marked by teacher and should be reflected in the final mark.
            <form id="newGradedTask" onSubmit={this.handleSubmit}>
                <div className="form-group">   
                    <label htmlFor="name">Task name:</label>
                    <input type="text" className="form-control" id="idTaskName" name="name" value={this.state.name} onChange={this.handleInputChange} required/>  

                </div>
                
                <div className="form-group">   
                    <label htmlFor="description">Task description:</label>
                    <textarea rows="4" cols="50" className="form-control" id="idTaskDescription" name="description" defaultValue={this.state.description} onChange={this.handleInputChange}></textarea>
                </div>
                <div className="form-group">   
                    <label htmlFor="term">Task term:</label>
                    <select id="termTask" name="term" value={this.state.term || '1st Term'} onChange={this.handleInputChange}>
                        <option value="1st Term">1st Term</option>
                        <option value="2nd Term">2nd Term</option>
                        <option value="3rd Term">3rd Term</option>
                  </select>
                </div>

                <div className="form-group">   
                    <label id="labelWeight" htmlFor="weight">Task Weight (0-{this.state.allowedWeight} %):</label>
                    <input type="number" name="weight" className="form-control" min="1" max ={this.state.allowedWeight} id="idTaskWeight" defaultValue={this.state.weight} onChange={this.handleInputChange} required/>
                </div>
                <input type="submit" className="btn btn-primary" value="Save"/>
            </form> 

            </div>
            
            
        );
    }
}

export default GradedTaskPage;
