import React from 'react';
import {events} from '../../lib/eventsPubSubs.js';
import Dropzone from 'react-dropzone';
import T from 'i18n-react';
import Settings from '../../classes/settings.js';

class UploadPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            accept: 'application/pdf',
            files: [],
            dropzoneActive: false,
            objectURL:'',
            pdfUploaded:false,
            border :"5px dashed red"
        };
        T.setTexts(require('../../lib/i18n/' + Settings.getLanguage() + '.json'));   
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
        pdfUploaded:true,
        border : "5px dashed green"
      });
      this.setState({
        dropzoneActive: false,
        files: files        
      });
      $('#newSubjectForm').hide();
      //$('#dragPdfReport').show();
      $('#hr-text').hide();
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
      //formData.append('subjectName',event.target.subjectName.value);
      events.publish('menu/sendFile',{'formData':formData,'subjectName':event.target.subjectName.value});
    }
    
    render() {
        const dropzoneStyle = {
          width  : "100%",
          height : "25%",
          border: this.state.border,
          padding: "15px",
          borderRadius:20                    
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
        <div className="dragPdfReport">
          <hr className="hr-text" data-content={T.translate("uploadPDFOr")} id="hr-text"/>
            <p className="desc small">{T.translate("uploadPDFAdvice")}</p>
            <div> 
            {/* Asi es la part del drop zone */}
              <form id="newFile" encType="multipart/form-data" className="formDetail small" onSubmit={this.handleSubmit}>
                <Dropzone className="Dropzone"
                    onDrop={this.onDrop.bind(this)}
                    style={dropzoneStyle}
                    accept={accept}
                    onDragEnter={this.onDragEnter.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)}
                    name="myFile">
                    <p>{T.translate("uploadPDFExplanation")}</p>
                    {T.translate("uploadPDFDroppedFiles")}
                    
                  <ul>
                    {
                      files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                    }
                  </ul>
                </Dropzone>
                <br/>
                <img src="ajax-loader.gif" id="loading" style={{display:"none"}} />
                  
                {this.state.pdfUploaded ?  
                <div className="formInput"><label>{T.translate("uploadPDFSubjectName")}: </label>
                  <input type="text" name="subjectName" required/>
                </div> : null}
               <br/>
              <input type="submit" className="btn btn-primary" value={T.translate("uploadPDFCreateSubject")}/>
              </form>
            </div>
            <img id="output"/>
        </div>
        );
    }
    
}

export default UploadPage;