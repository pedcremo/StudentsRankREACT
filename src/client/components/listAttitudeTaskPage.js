import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import AttitudeItemPage from './attitudeItemPage.js';
import Modal from 'react-bootstrap4-modal';

class ListAttitudeTaskPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
                student: props.student,
                attitudeTasks: props.attitudeTasks,
                visible:true,
                points:20, //Default number of points for a new Attitude Task
                description:''
        };                      
        
        this.handleInputChange = this.handleInputChange.bind(this);  
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    modalBackdropClicked(event) {        
        this.setState({
            visible: !this.state.visible
          });       
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();              
        let data={'studentId':this.state.student.id,'idAttitudeTask':'','points':this.state.points,'description':this.state.description}
        console.log(JSON.stringify(data));
        events.publish('dataservice/SaveAttitudeTask',data);        
    }   

    render() {
        let attitudeItems = this.state.attitudeTasks.map((attitudeItem) =>         
            <AttitudeItemPage key={attitudeItem[1].id} handleClick={this.modalBackdropClicked} studentId={this.state.student.id} attitudeItem={attitudeItem}/>                  
        ); 
        
        
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">XP to {this.state.student.surname} ,{this.state.student.name}</h5>
                        <button type="button" className="close" data-dismiss="modal" onClick={this.modalBackdropClicked} aria-label="Close">
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
                    <form id="newAttitudeTask" onSubmit={this.handleSubmit} className="form-inline">
                        <div className="form-group">
                            <label  htmlFor="points">Points: </label>
                            <input type="text" name="points" id="points" size="3" value={this.state.points} className="text ui-widget-content ui-corner-all" onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Text:</label>
                            <input type="text" name="description" id="description" value={this.state.description} className="text ui-widget-content ui-corner-all" onChange={this.handleInputChange}/>
                        </div>
                        <input type="submit" value="New XP task" />                  
                    </form>                        
                    <button type="button" className="btn btn-secondary" onClick={this.modalBackdropClicked} id="closeModal" data-dismiss="modal">Close</button>          
                </div>                
            </Modal>
        );
    }
}

export default ListAttitudeTaskPage;