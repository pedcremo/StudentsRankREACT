import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';

class SubjectModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                              
        };                              
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        
    }
    modalBackdropClicked(event) {        
        this.setState({
            visible: !this.state.visible
          });       
    }


    render() {        
        
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add new subject</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">       
                            <form id="newSubject" className="form-inline"> 
                                <div className="form-group">
                                    <label htmlFor="text">Subject name:</label>
                                    <input type="text" name="text" id="subjectName" value="" className="text ui-widget-content ui-corner-all" />
                                </div>
                                <input type="submit" value="New Subject" id="newSubjectInput" />
                                
                                
                                At the moment of subject creation you are able if you want to reuse students created by other people make your choice:
                                <select name="sharedGroups" id="sharedGroups">
                                    
                                </select>
                            </form>     
                        </div>                        
                    </div>
                    </div>   
                </div>
                <div className="modal-footer">                         
                    <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal">Close</button>          
                </div>
                </div>
            </Modal>
        );
    }
}

export default SubjectModalPage;