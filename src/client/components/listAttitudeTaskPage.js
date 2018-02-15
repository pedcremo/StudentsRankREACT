import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import AttitudeItemPage from './attitudeItemPage.js';

class ListAttitudeTaskPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
                student: props.student,
                attitudeTasks: props.attitudeTasks                
               
        };            
          
        //this.handleXPonClick = this.handleXPonClick.bind(this); 
        /*this.handleSubmit = this.handleSubmit.bind(this);    
        this.handleProfileChange = this.handleProfileChange.bind(this);*/
        this.handleInput = this.handleInput.bind(this); 
    }
    handleInput(event) {
        //debugger;
        event.preventDefault();
        alert('NO ES VERDAD angel de amor');
    }
    componentDidMount() {
        $('#XPModal').modal('toggle');
    }
    componentWillUnmount() {
        //alert("HIIIII");
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    /*handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);       
      
        events.publish('dataservice/SavePerson',{'studentProps':this.state,'formData':formData});        
    }

    handleProfileChange(event) {
        let outputImg = $('#output');
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function() {
          let dataURL = reader.result;
          //output = document.getElementById('output');
          outputImg.attr('src',dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }*/

    render() {
        let attitudeItems = this.state.attitudeTasks.map((attitudeItem) =>         
            <AttitudeItemPage key={attitudeItem[1].id} studentId={this.state.student.id} attitudeItem={attitudeItem}/>           
        ); 
        
        return (
            /* Modal */            
            <div onClick={this.handleInput} className="modal fade" id="XPModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">XP to {this.state.student.surname} ,{this.state.student.name}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                               {attitudeItems}                             
                            </div>  
                        </div>          
                        
                    </div>
                    </div>   
                </div>
                <div className="modal-footer">                    
                    <form id="newAttitudeTask" className="form-inline">
                        <div className="form-group">
                            <label  htmlFor="points">Points: </label>
                            <input type="text" name="points" id="points" size="3" value="20" className="text ui-widget-content ui-corner-all" onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Text:</label>
                            <input type="text" name="text" id="description" value="" className="text ui-widget-content ui-corner-all" onChange={this.handleInputChange}/>
                        </div>
                        <input type="submit" value="New XP task" />                  
                    </form>                        
                    <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal">Close</button>          
                </div>                
            </div>
            </div>                   
        );
    }
}

export default ListAttitudeTaskPage;