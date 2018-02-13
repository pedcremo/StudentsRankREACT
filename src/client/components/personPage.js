import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Person from '../classes/person.js';
import {loadTemplate} from '../lib/utils.js';

class PersonPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
                name: props.student.personInstance?props.student.personInstance.name:'',
                surnames: props.student.personInstance?props.student.personInstance.surname:'',
                id: props.student.personInstance?props.student.personInstance.id:'huevon'
               
        };        
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
       
        let id=this.state.id;
        if (id==='huevon') {
            let student = new Person(this.state.name,this.state.surnames,[]);
            id=student.id;    
        }
        formData.append('idStudent',id);
        debugger;       
        loadTemplate('api/uploadImage',function(response) {
                console.log(response);
        },'POST',formData,'false');
        //$.post( 'api/uploadImage', formData );
        events.publish('dataservice/SavePerson',this.state);        
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
            <h3>Add new Student</h3>
                <form id="newStudent" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">First name:</label>
                        <input type="text"  className="form-control" id="idFirstName" name="name" value={this.state.name} onChange={this.handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surnames">Surnames:</label>
                        <input type="text"  className="form-control" id="idSurnames" name="surnames" value={this.state.surnames} onChange={this.handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Profile image</label>
                        <input type="file" id="myProfile" name="myImage" accept="image/jpeg" onChange={this.handleProfileChange} />
                        <img id="output" src={'src/server/data/fotos/'+this.state.id+'.jpg'} />
                    </div>
                
                    <input type="submit" className="btn btn-primary" value="Save" />
                </form> 
            </div>
            
        );
    }
}

export default PersonPage;