import React from 'react';

class GradedTaskPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            taskName: '',
            taskDescription:'',
            
        }
    }
    render() {
        return (
            <div>
            <h3>Add new Graded Task REACT COMPONENT</h3>  
            We understand as a graded task any test or practice that will be marked by teacher and should be reflected in the final mark.
            </div>
            
            
        );
    }
}


export default GradedTaskPage;