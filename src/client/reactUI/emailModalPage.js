import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import{loadTemplate} from '../lib/utils.js';
//import UploadPage from './uploadPDFPage.js';

class EmailModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {  
            visible: true,
            students:props.students,
            message:'',
            subject:''   
        };
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleinput = this.handleinput.bind(this);                              
        
    }



    handleinput(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
     }


    handleSubmit(event){
            event.preventDefault();
        debugger;
            //let formData = new FormData(event.target);
            let filteredStudents= this.state.students.filter((itemStudent) => {                       
                return itemStudent.email;
            }).map((itemPerson) => {
               return itemPerson.email;     
            });

        
            
            let data={emailTo:filteredStudents.toString(),subject:this.state.subject,message:this.state.message};
            //formData.emailto = filteredStudents; 
            data=JSON.stringify(data);
            loadTemplate('/api/sendEmail',function(response){
                console.log(response);
            },'POST',data,'false');
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
            return <div className="badge badge-secondary mr-1" title={item.surname+','+item.name} >{item.email} <i className="fa fa-close ml-1" id={item.id} onClick={this.deleteEmail}></i></div> 
        });

        let prova='';
        const filteredStudentsnoemail= this.state.students.filter((itemStudent) => {                       
            return !itemStudent.email;
        }).map((item) => {
            prova+=item.name+',';
            return <div>{item.name} No te email</div> 
        });

       
        
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"/>


            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel" align="center">Send email</h5>
                <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
          
                          
                                <form id="newSubject"  onSubmit={this.handleSubmit} align="center"   method="post"> 
                            {filteredStudents}
                                <p className="text-danger">{filteredStudents.length<this.state.students.length?'Cuidao '+(this.state.students.length-filteredStudents.length)+ ' estudiants no tenen email: '+prova:null} </p>
                                
                                 <label htmlFor="assunto">Assunto:</label>
                                 <br/>
                                <input type="text" name="subject" id="assunto" value={this.state.subject} onChange={this.handleinput} size="40"/>

                                <br/><br/>


                                <label htmlFor="message">Message:</label>
                                <br/>
                                <textarea type="text" name="message" id="message" rows="5" cols="40" value={this.state.message} onChange={this.handleinput} ></textarea>

                                <br/><br/>

                                 <button type="Submit" name="SubmitProductos" value="Submit" id="Submit"  >Send email</button>
                        </form> 
           </div>
          
        </Modal>
    );
}
}

export default EmailModalPage;