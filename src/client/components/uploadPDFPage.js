import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Dropzone from 'react-dropzone';

class UploadPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            accept: 'application/pdf',
            files: [],
            dropzoneActive: false,
            objectURL:'',
            pdfUploaded:false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onDragEnter() {
        this.setState({
          dropzoneActive: true
        });
    }
    
    onDragLeave() {
      this.setState({
        dropzoneActive: false
      });
    }
    
    onDrop(files) {
      this.setState({
        files: files,
        dropzoneActive: false,
        pdfUploaded:true
      });
    }
     
    handleSubmit(event) {
      event.preventDefault();
      console.log(event.target);
      var formData = new FormData(event.target);
      if (this.state.pdfUploaded) {
        formData.append('myFile',this.state.files[0], this.state.files[0]); 
      }
      for (var [key, value] of formData.entries()) { 
        console.log(key, value);
      }
      debugger;
      //formData.append('subjectName',event.target.subjectName.value);
      events.publish('menu/sendFile',{'formData':formData,'subjectName':event.target.subjectName.value});
    }
    
    render() {
        const dropzoneStyle = {
          width  : "100%",
          height : "35%",
          border : "5px dashed #42c5f4",
          padding: "15px"
        };
        const overlayStyle = {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          padding: '2.5em 0',
          background: 'rgba(0,0,0,0.5)',
          textAlign: 'center',
          color: '#fff'
        };
        const { accept, files, dropzoneActive } = this.state;
        return (
        <section>
          <hr className="hr-text" data-content="OR"/>
            <p className="desc small">Drag and Drop your ITACA Student's class PDF report</p>
            <div className="dropzone">
              <form id="newFile" enctype="multipart/form-data" className="formDetail small" onSubmit={this.handleSubmit}>
                <Dropzone
                    onDrop={this.onDrop.bind(this)}
                    style={dropzoneStyle}
                    accept={accept}
                    onDragEnter={this.onDragEnter.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)}
                    name='myFile'
                >
                    <p>Drop a PDF file exported from <a href="http://docent.edu.gva.es">http:/docent.edu.gva.es</a>, or click to select files to upload.</p>
                    Dropped files
                  <ul>
                    {
                      files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                    }
                  </ul>
                </Dropzone>
                <img src="ajax-loader.gif" id="loading" style={{display:'none'}} />
                
                {this.state.pdfUploaded ? 
                <div className="formInput"><label>Subject Name: </label>
                  <input type="text" name="subjectName" required/>
                </div> : null}
               
              <input type="submit" className="btn btn-primary" value="Click here to create subject"/>
              </form>
            </div>
            <img id="output"/>
        </section>
        );
    }
    
}

export default UploadPage;
