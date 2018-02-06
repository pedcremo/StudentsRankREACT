import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class RankingListItemGradedTasksPage extends React.Component {
    constructor(props){
        super(props);
        //debugger;
        //const markNames = this.state.marks.map((mark) =>            
        //<td key={mark.id+mark.idStudent}><a className="text-info" href={'#detailGradedTask/'+ mark.id}> {mark.name} {mark.weight}%</a></td>
        //);
        this.state = {                
            marks:props.marks                     
        };  
        props.marks.map((itemMark) =>
            this.setState({
                [itemMark.id+itemMark.idStudent]: itemMark.points
            })
            //this.state[itemMark.id+itemMark.idStudent]=itemMark;
        );        
             
        
        this.handleInputChange = this.handleInputChange.bind(this);   
        //this.handleSubmit = this.handleSubmit.bind(this);      

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
              [name]: value
        });
        console.log('HANDLE INPUT '+value);
        
    }

    /*handleSubmit(event) {
        event.preventDefault();
        //events.publish('dataservice/SaveGradedTask',this.state);        
    }*/

    render() {
        const markNames = this.state.marks.map((mark) =>            
            <td key={mark.id+mark.idStudent}><a className="text-info" href={'#detailGradedTask/'+ mark.id}> {mark.name} {mark.weight}%</a></td>
        );
        const marks = this.state.marks.map((mark) =>
            <td key={'p'+mark.id+mark.idStudent}><input name={mark.id+mark.idStudent} type='number' className='gradedTaskInput' idstudent={mark.idStudent} idgradedtask={mark.id} min='0' max='100' value={mark.points} onChange={this.handleInputChange} /></td>
        );
        return (
            <tr className="tableGradedTasks">
                    <table className="tableGradedTasks hidden" >
                    <tbody>
                    <tr>
                        {markNames}            
                    </tr>                
                    <tr>    
                        {marks} 
                    </tr>
                    </tbody>
                </table>
            </tr>                        
        );
    }
}

export default RankingListItemGradedTasksPage;
