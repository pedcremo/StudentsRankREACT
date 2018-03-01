import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import UploadPage from './uploadPDFPage.js';

class EmailModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            asunto:'',
            text:'',
            visible:true,
            arraystudents:[]
        };
        this.props.students.forEach((studentID)=>{
            let student= this.props.studentsMap.get(studentID);
            this.state.arraystudents.push(student.email);
        })

        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);                              
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        
    }
    /* Hide modal when closed or click background */
    modalBackdropClicked(event) {        
        this.setState({
            visible: !this.state.visible
          });       
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.state.arraystudents.forEach((studentemail)=>{
            let obj = {
                student:studentemail,
                data:this.state
            }
            events.publish("react/sendemail",obj);
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;       
        this.setState({
          [name]: value
        });
    }

    render() {
        return (
            /* Modal */
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">SendEmail</h5>
                    <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                        {this.state.arraystudents.toString()}
                            <form id="newSubject" onSubmit={this.handleSubmit}> 
                                <div className="form-group">
                                    <label htmlFor="text">Subject:</label><br/>
                                    <input type="text" name="asunto" id="subjectName" onChange={this.handleInputChange} value={this.state.asunto} className="text ui-widget-content ui-corner-all" /> 
                                    <br/>
                                    <label htmlFor="textarea">Text:</label><br/>
                                    <textarea type="textarea" name="text" id="subjectName" onChange={this.handleInputChange} value={this.state.text} className="text ui-widget-content ui-corner-all"></textarea>
                                </div>
                                <input type="submit" value="Send Email" id="newSubjectInput" /> 
                            </form>
                        </div>                        
                    </div>
                    </div>
                </div>
               
                <div className="modal-footer">                         
                    <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal" onClick={this.modalBackdropClicked}>Close</button>          
                </div>
                </div>
            </Modal>
        );
    }
}

export default EmailModalPage;