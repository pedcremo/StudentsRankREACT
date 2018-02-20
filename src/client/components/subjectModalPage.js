import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';

class SubjectModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            sharedGroups: props.sharedGroups,
            selectedSharedGroup:'',
            newSubject:'',
            visible:true                         
        };

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
        events.publish('menu/addsubject',this.state);   
        this.modalBackdropClicked(undefined);     
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
        const sharedGroups = this.state.sharedGroups.map((sub, i) =>                                
            <option key={i} name="selectedShared" value={sub.defaultSubject}  >{sub.defaultSubject} {sub.hits}  students</option>
        )
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add new subject</h5>
                    <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">       
                            <form id="newSubject" className="form-inline" onSubmit={this.handleSubmit}> 
                                <div className="form-group">
                                    <label htmlFor="text">Subject name:</label>
                                    <input type="text" name="newSubject" id="subjectName" onChange={this.handleInputChange} value={this.state.text} className="text ui-widget-content ui-corner-all" />
                                </div>
                                <input type="submit" value="New Subject" id="newSubjectInput" />
                                
                                
                                At the moment of subject creation you are able if you want to reuse students created by other people make your choice:
                                <select name="selectedSharedGroup" id="sharedGroups" onChange={this.handleInputChange}>
                                    <option value="" ></option>
                                   {sharedGroups}
                                </select>
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

export default SubjectModalPage;