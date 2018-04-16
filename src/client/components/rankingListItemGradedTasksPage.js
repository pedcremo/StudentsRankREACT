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
         
                    <li className="list-group-item"> 
                     <div className="row">  
                        {!this.state.readOnly ? <div className="col-9"><a className="text-info text-left" href={'#detailGradedTask/'+this.state.id}> {this.state.name}({this.state.weight}%)</a></div>                        
                        : <span className={"badge "+(this.state.points>=50?'badge-success':'badge-danger')}>{this.state.points}</span>}
                        
                        {!this.state.readOnly ?                          
                            <div className="col-3"><input type='number' name='points' className='gradedTaskInput form-control form-control-sm' idstud={this.state.id_student} idgtask={this.state.id}  min='0' max='100' value={this.state.points} onChange={this.handleInputChange}/></div> 
                        : <span className="text-info">&nbsp; {this.state.name}({this.state.weight}%) </span>} 
                    </div>
                    </li>
                
            );
    }
}

export default RankingListItemGradedTasksPage;
