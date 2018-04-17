import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import UploadPage from './uploadPDFPage.js';
import T from 'i18n-react';
import Settings from '../classes/settings.js';

class SubjectModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            sharedGroups: props.sharedGroups,
            selectedSharedGroup:'',
            newSubject:'',
            visible:true,
            couldBeClosed:props.couldBeClosed                        
        };
        T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'));   
        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);                              
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        
    }
    /* Hide modal when closed or click background */
    modalBackdropClicked(event) { 
        if (this.state.couldBeClosed) {       
            this.setState({
                visible: !this.state.visible
            });       
        }
    }
    
    handleSubmit(event) {
        event.preventDefault();
        events.publish('menu/addsubject',this.state);
        this.setState({
            couldBeClosed: true
        },function(){
            this.modalBackdropClicked(undefined);     
        });       
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;       
        this.setState({
          [name]: value
        });
        
        if (name==="newSubject" && value===""){
            console.log("llore")
            $(".dragPdfReport").show();
            
       }else{
            $(".dragPdfReport").hide();
       }           
    }

    render() {        
        const sharedGroups = this.state.sharedGroups.map((sub, i) =>                                
            <option key={i} name="selectedShared" value={sub.defaultSubject}  >{sub.defaultSubject} {sub.hits}  {T.translate("subjectModalStudents")}</option>
        )
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{T.translate("subjectModalAddNew")}</h5>
                    {this.state.couldBeClosed ? 
                        <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                       
                    <span aria-hidden="true">&times;</span>
                    </button>
                     :null}
                </div>
                <div id="newSubject" className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12" >        
                            <form id="newSubjectForm" className="form-inline" onSubmit={this.handleSubmit}> 
                                <div className="form-group">
                                    <label htmlFor="text">{T.translate("subjectModalName")}:</label>
                                    <input type="text" className="form-control" name="newSubject" id="subjectName" onChange={this.handleInputChange} value={this.state.text} className="text ui-widget-content ui-corner-all" />
                                    
                                </div>                                
                                <p><span className="small">{T.translate("subjectModalAdvice")}:</span></p>
                                <select name="selectedSharedGroup" id="sharedGroups" onChange={this.handleInputChange}>
                                    <option value="" ></option>
                                   {sharedGroups}
                                </select>
                                <input type="submit" className="btn mt-2 mb-2 btn-primary" value={T.translate("uploadPDFCreateSubject")} id="newSubjectInput" />                                                                
                                
                            </form>     
                        </div>                        
                    </div>
                    </div>   
                    <UploadPage />
                </div>
               
               
                </div>
            </Modal>
        );
    }
}

export default SubjectModalPage;