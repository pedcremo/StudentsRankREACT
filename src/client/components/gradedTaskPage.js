import React from 'react';

class GradedTaskPage extends React.Component {
    constructor(props){
        super(props);
        const terms = props.terms;
        const Termitems = terms.map((term) =>
            <option selected value={term.name}>{term.name}</option>            
        );     
    }

    render() {
        return (
            <div>
            <h3>Add new Graded Task REACT COMPONENT</h3>  
            We understand as a graded task any test or practice that will be marked by teacher and should be reflected in the final mark.
            <form id="newGradedTask">
                <div class="form-group">   
                    <label for="name">Task name:</label>
                    <input type="text" class="form-control" id="idTaskName" name="taskname" value={ this.props.gtInstance.name }  required /> 
                </div>
                
                <div class="form-group">   
                    <label for="description">Task description:</label>
                    <textarea rows="4" cols="50" class="form-control" id="idTaskDescription" name="taskdescription" value="">{this.props.gtInstance.description}</textarea>
                </div>
                <div class="form-group">   
                    <label for="term">Task term:</label>
                    <select id="termTask">
                        <Termitems />
                    </select>
                    </div>

                <div class="form-group">   
                    <label id="labelWeight" for="weight">Task Weight (0-100 %):</label>
                    <input type="number" class="form-control" min="1" max ="100" id="idTaskWeight" name="taskweight" value={this.props.gtInstance.weight} required />
                </div>
                    <input type="submit" class="btn btn-primary" value="Save" />
                </form> 
            </div>             
        );
    }
}


export default GradedTaskPage;