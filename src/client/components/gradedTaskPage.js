import React from 'react';

class GradedTaskPage extends React.Component {
    constructor(props){
        super(props);  
        
        this.state = {
            name: props.gtInstance.name,
            description: props.gtInstance.description,
            weight: props.gtInstance.weight,
            term: props.gtInstance.term
        }
        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);       
    }
    
    handleSubmit(event) {
        alert('A graded task was submitted '+ JSON.stringify(this.state));
        event.preventDefault();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    render() {
        return (
            <div>
            <h3>Add new Graded Task REACT COMPONENT</h3>  
            We understand as a graded task any test or practice that will be marked by teacher and should be reflected in the final mark.
            <form id="newGradedTask" onSubmit={this.handleSubmit}>
                <div className="form-group">   
                    <label htmlFor="name">Task name:</label>
                    <input type="text" className="form-control" id="idTaskName" name="taskname" value={ this.state.name }  required /> 
                </div>
                
                <div className="form-group">   
                    <label htmlFor="description">Task description:</label>
                    <textarea rows="4" cols="50" className="form-control" id="idTaskDescription" name="taskdescription" value={this.state.description} />
                </div>
                <div className="form-group">   
                    <label htmlFor="term">Task term:</label>
                    <select id="termTask" value={this.state.term}>
                        {this.props.terms.map((term, index) => (                      
                            <option key={index} value={term.name}>{term.name}</option>
                        ))}                    
                    </select>
                    </div>

                <div className="form-group">   
                    <label id="labelWeight" htmlFor="weight">Task Weight (0-100 %):</label>
                    <input type="number" className="form-control" min="1" max ="100" id="idTaskWeight" name="taskweight" value={this.state.weight} required />
                </div>
                    <input type="submit" className="btn btn-primary" value="Save" />
                </form> 
            </div>             
        );
    }
}


export default GradedTaskPage;