import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class RankingListItemGradedTasksPage extends React.Component {
    constructor(props){
        super(props); 
        this.state = {         
            id:this.props.studentgt.id, 
            id_student:this.props.studentgt.idStudent,
            name:this.props.studentgt.name,
            weight:this.props.studentgt.weight,
            points:this.props.studentgt.points,
            readOnly:props.readOnly      
       };        
        
        this.handleInputChange = this.handleInputChange.bind(this);
    }
   
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });       
    
        let data={"idPerson":this.state.id_student,"idGradedTask":this.state.id,"value":target.value}
        events.publish('component/changingGTPoints',data);
    }
    
    render() {
      
        return (                
            <div className="tableGradedTasks row" style={{display:'none'}}>
                        <div className="row">
                            {!this.state.readOnly ? <a className="text-info" href={'#detailGradedTask/'+this.state.id}> {this.state.name}({this.state.weight}%)</a> 
                        : <span className="text-info">{this.state.name}({this.state.weight}%)</span>}
                        </div>
                        <div className="row">
                            {!this.state.readOnly ? 
                                <input type='number' name='points' className='gradedTaskInput' idstud={this.state.id_student} idgtask={this.state.id}  min='0' max='100' value={this.state.points} onChange={this.handleInputChange}/>
                                : <span className="text-info">{this.state.points}</span>}

                        </div>   
            </div>                       
            );
    }
}

export default RankingListItemGradedTasksPage;
