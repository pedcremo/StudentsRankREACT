import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class RankingListItemGradedTasksPage extends React.Component {
    constructor(props){
        super(props); 
        //{'id':valueGT.id,'idStudent':this.id,'points':valueGT.studentsMarkMAP.get(this.id),'name':valueGT.name,'weight':valueGT.weight}     
        this.state = {         
            id:this.props.studentgt.id, 
            id_student:this.props.studentgt.idStudent,
            name:this.props.studentgt.name,
            weight:this.props.studentgt.weight,
            points:this.props.studentgt.points        
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
                        <td>
                                <a className="text-info" href={'#detailGradedTask/'+this.state.id}> {this.state.name}({this.state.weight}%)</a>           
                                <input type='number' name='points' className='gradedTaskInput' idstud={this.state.id_student} idgtask={this.state.id}  min='0' max='100' value={this.state.points} onChange={this.handleInputChange}/>
                        </td>                        
            );
    }
}

export default RankingListItemGradedTasksPage;
