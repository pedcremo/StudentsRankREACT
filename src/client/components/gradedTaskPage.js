import React from 'react';

class GradedTaskPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            taskName: '',
            taskDescription:''
        }
    }
    render() {
        return (
            <h3>Add new Graded Task REACT COMPONENT</h3>          
        );
    }
}


export default GradedTaskPage;