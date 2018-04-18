import React from 'react';
import {events} from '../../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import Settings from '../../classes/settings.js';
import T from 'i18n-react';

class ListAttitudeTaskPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
                //student: props.student,
                students: props.students,
                attitudeTasks: props.attitudeTasks.sort(function(a,b) {
                                    return (b[1].hits - a[1].hits);
                                }),
                visible:true,
                points:20, //Default number of points for a new Attitude Task
                traductions: T.setTexts(require('../../lib/i18n/' + Settings.getLanguage() + '.json')),
                description:''
        };                              
        this.handleXPclick = this.handleXPclick.bind(this);  
        this.handleInputChange = this.handleInputChange.bind(this);  
        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    modalBackdropClicked(event) {        
        this.setState({
            visible: !this.state.visible
          });       
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    handleXPclick(event) {    
        let xpButton=event.target;    
        let data= this.state.students.map((student) => {
            return {'studentId':student.id,'idAttitudeTask':xpButton.id};
        });        
        events.publish('dataservice/SaveAttitudeTask',data); 
        this.modalBackdropClicked();                    
    }

    handleSubmit(event) {
        event.preventDefault();     
        let data= this.state.students.map((student) => {
            return {'studentId':student.id,'idAttitudeTask':'','points':this.state.points,'description':this.state.description};
        });
        events.publish('dataservice/SaveAttitudeTask',data);        
        this.modalBackdropClicked();
    }   

    render() {
        let attitudeItems = this.state.attitudeTasks.map((attitudeItem) =>         
            <button onClick={this.handleXPclick} id={attitudeItem[1].id} key={attitudeItem[1].id} className={'xp btn btn-'+attitudeItem[1].type}  value={attitudeItem[1].points}>{attitudeItem[1].points} {attitudeItem[1].description}</button>                                   
        );       
        
        let persons = this.state.students.map((student) => {
            if (this.state.students.length === 1){
                return student.surname +' ,'+student.name;
            }else{
                return student.name + ' ,';
            }
        });
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">XP  {T.translate("to")} {persons}</h5>
                        <button type="button" className="close" data-dismiss="modal" onClick={this.modalBackdropClicked} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                               {attitudeItems}                             
                            </div>  
                        </div>          
                        
                    </div>
                    </div>   
                </div>
                <div className="modal-footer">                    
                    <form id="newAttitudeTask" onSubmit={this.handleSubmit} className="form-inline">
                        <div className="form-group">
                            <label  htmlFor="points"> {T.translate("points")}: </label>
                            <input className="form-control" maxLength="3" type="number" name="points" id="points" size="3" value={this.state.points} className="text ui-widget-content ui-corner-all" onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text"> {T.translate("text")}:</label>
                            <input className="form-control" type="text" name="description" id="description" value={this.state.description} className="text ui-widget-content ui-corner-all" onChange={this.handleInputChange}/>
                        </div>
                        <button className="btn btn-primary ml-2" type="submit">{T.translate("NewXPTask")}</button>                  
                    </form>                        
                    {/* <button type="button" className="btn btn-secondary" onClick={this.modalBackdropClicked} id="closeModal" data-dismiss="modal"> {T.translate("close")}</button> */}          
                </div>                
            </Modal>
        );
    }
}

export default ListAttitudeTaskPage;