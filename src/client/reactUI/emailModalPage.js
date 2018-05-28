import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import{loadTemplate} from '../lib/utils.js';
import {context} from '../context.js'; //Singleton
//import UploadPage from './uploadPDFPage.js';
import { Editor } from '@tinymce/tinymce-react';

class EmailModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {  
            visible: true,
            students:props.students,
            templates:props.templates,
            message:'',
            subject:''   
        };
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleinput = this.handleinput.bind(this);   
        this.templatecombochange= this.templatecombochange.bind(this);                          
       
    }

    templatecombochange(event){
        
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let message = this.state.templates.filter(function(item) {
            return item.subject == value
        });
        message = message[0].message;

        this.setState({
            'subject':value,
            'message':message
        });



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
            let close=this.modalBackdropClicked;
            
            loadTemplate('/api/sendEmail',function(response){
                if (response=='OK'){
                    close(undefined);
                    context.notify("Email send","Email notification");
                    
                }else{

                    context.notify("Email send error","Email notification",'error');
                } 


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
            return <div className="badge badge-secondary mr-1 mt-2" title={item.surname+','+item.name}>{item.email}<i className="fa fa-close ml-1" id={item.id} onClick={this.deleteEmail}></i></div> 
        });


        const filteredtemplate= this.state.templates.map((item) => {
            return <option key={item.subject} value={item.subject}>{item.subject}</option> 
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
                <h5 className="modal-title" id="exampleModalLabel" >Send Email</h5>
                <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
          
                          
                                <form id="newSubject"  onSubmit={this.handleSubmit} align="center"   method="post"> 
                            {filteredStudents}
                                <p className="text-danger">{filteredStudents.length<this.state.students.length?'Cuidao '+(this.state.students.length-filteredStudents.length)+ ' estudiants no tenen email: '+prova:null} </p>
                                
                                 <label htmlFor="assunto">Assumpte</label>
                                 <br/>
                                <input  type="text" name="subject" id="assunto" className="form-control " value={this.state.subject} onChange={this.handleinput} size="40"  />


                                         <br/>
                        <label htmlFor="message">Menssage:</label>
                             <div className="" >
                                <Editor
                      
                                        name="message"
                                        id="message"
                                        value={this.state.message}
                                        init={{ 
                                        // plugins: 'link image code',
                                        // toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code |'
                                        plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount tinymcespellchecker a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
                                        toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                                        }}
                                        onChange={this.handleinput}   
                                    />
                                    
                                </div>

                                <br/> 

                                {/* <select onChange={this.handleinput}> */}
                                <select class="selectpicker" value={this.state.message} name={this.state.subject} onChange={this.templatecombochange}>
                                {filteredtemplate}
                                </select>


                                 <br/><br/>

                                 <button type="Submit" name="SubmitProductos" className="btn btn-success" value="Submit" id="Submit"  >Send Email</button>
                        </form> 
           </div>
          
        </Modal>
    );
}
}

export default EmailModalPage;