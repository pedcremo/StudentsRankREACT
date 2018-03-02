import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import T from 'i18n-react';
import Settings from '../classes/settings.js';

class PersonPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
                name: props.student.personInstance?props.student.personInstance.name:'',
                surname: props.student.personInstance?props.student.personInstance.surname:'',
                email: props.student.personInstance?props.student.personInstance.email:'',
                id: props.student.personInstance?props.student.personInstance.id:'huevon'
               
        };        
        
        //let messages = getTraductionOfMessages(Settings.getLanguage());
        //let messages = Settings.getTraductedText();
        //T.setTexts(messages, { MDFlavor: 0 });
        T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
        
        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);    
        this.handleProfileChange = this.handleProfileChange.bind(this);
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
    }

    render() {
        return (
            <div>
            <h3>{T.translate("addStudentTitle")}</h3>
                <form id="newStudent" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">{T.translate("addStudentLblFirstName")}</label>
                        <input type="text"  className="form-control" id="idFirstName" name="name" value={this.state.name} onChange={this.handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">{T.translate("addStudentLblsurnames")}</label>
                        <input type="text" className="form-control" id="idsurname" name="surname" value={this.state.surname} onChange={this.handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">{T.translate("addStudentLblEmail")}</label>
                        <input type="email"  className="form-control" id="idEmail" name="email" value={this.state.email} onChange={this.handleInputChange}  />
                    </div>

                    <div className="form-group">
                        <label>{T.translate("addStudentLblProfileImage")}</label>
                        <input type="file" id="myProfile" name="myImage" accept="image/jpeg" onChange={this.handleProfileChange} />
                        <img id="output" src={'src/server/data/fotos/'+this.state.id+'.jpg'} />
                    </div>
                
                    <input type="submit" className="btn btn-primary" value={T.translate("addStudentInputSave")} />
                </form> 
            </div>
            
        );
    }
}

export default PersonPage;