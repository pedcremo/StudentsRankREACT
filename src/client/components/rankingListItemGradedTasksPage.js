import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class RankingListItemGradedTasksPage extends React.Component {
    constructor(props){
        super(props);
        //debugger;
        this.state = {                
            marks:props.marks                     
        };        
        
        /*this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);      */

    }

    /*handleInputChange(event) {
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
    }*/

    render() {
        const markNames = this.state.marks.map((mark) =>            
            <td ><a className="text-info" href={'#detailGradedTask/'+ mark.id}> {mark.name} {mark.weight}%</a></td>
        );
        const marks = this.state.marks.map((mark) =>
            <td><input type='number' className='gradedTaskInput' idStudent={mark.idStudent} idGradedTask={mark.id} min='0' max='100' value={mark.points} /></td>
        );
        return (
            <tr className="tableGradedTasks">
                    <table className="tableGradedTasks" styles={{display:'none'}}>
                    <tr>
                        {markNames}            
                    </tr>                
                    <tr>    
                        {marks} 
                    </tr>
                </table>
            </tr>                        
        );
    }
}

export default RankingListItemGradedTasksPage;
