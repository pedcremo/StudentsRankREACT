import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import UploadPage from './uploadPDFPage.js';

class EmailModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {  
            visible: true,
            students:props.students   
        };
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
       // this.handleSubmit = this.handleSubmit.bind(this);                              
        
    }

   deleteEmail(event) {
        const target = event.target;
        const id = target.id;
       
        let newStudents = this.state.students.filter((itemStudent) => {                       
            return itemStudent.id != id;
        });
       
        this.setState({
          'students': newStudents
        });
   }

   /* Hide modal when closed or click background */
   modalBackdropClicked(event) {        
    this.setState({
        visible: !this.state.visible
      });       
    }

    render() {        
        /*const sharedGroups = this.state.sharedGroups.map((sub, i) =>                                
            <option key={i} name="selectedShared" value={sub.defaultSubject}  >{sub.defaultSubject} {sub.hits}  students</option>
        )*/
        const filteredStudents= this.state.students.filter((itemStudent) => {                       
            return itemStudent.email;
        }).map((item) => {
            return <div className="badge badge-secondary mr-1" title={item.surname+', '+item.name} >{item.email} <i className="fa fa-close ml-1" id={item.id} onClick={this.deleteEmail}></i></div> 
        });
        
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                <div className="modal-header">
                    <div><h5 className="modal-title" id="exampleModalLabel">Send email to </h5></div>
                    <div className="pt-1">&nbsp;{filteredStudents}</div>
                    <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        
                        <p className="text-danger">{filteredStudents.length<this.state.students.length?'OJO que hi han '+(this.state.students.length-filteredStudents.length)+ ' estudiants sense email':null}</p>
                    </div>
                    <div className="row">
                        <div className="col-md-12" >        
                            <form id="newSubject" className="form-inline" onSubmit={this.handleSubmit}> 
                                <div className="form-group">
                                    <label htmlFor="text">Subject name:</label>
                                    <input type="text" name="newSubject" id="subjectName" onChange={this.handleInputChange} value={this.state.text} className="text ui-widget-content ui-corner-all" />
                                </div>
                                <input type="submit" value="New Subject" id="newSubjectInput" />
                                
                                
                                <span className="small">At the moment of subject creation you are able to reuse students groups created by other people make your choice:</span>
                                
                            </form>     
                        </div>                        
                    </div>
                    </div>   
           
                </div>
               
               
                </div>
            </Modal>
        );
    }
}

export default EmailModalPage;