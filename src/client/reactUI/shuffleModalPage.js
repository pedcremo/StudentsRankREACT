import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import Modal from 'react-bootstrap4-modal';
import {shuffleArray} from '../lib/utils.js';
import {context} from '../context.js'; //Singleton

class ShuffleModalPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {     
            visible: true,     
            students:props.students            
        };           

        this.modalBackdropClicked = this.modalBackdropClicked.bind(this);       
    }
    
     /* Hide modal when closed or click background */
   modalBackdropClicked(event) {        
    this.setState({
        visible: !this.state.visible
      });       
    }

    render() {  
        
        const listStudents= this.state.students.map((item) => {
            return <li><img width='64px' height='64px' src={'src/server/data/fotos/'+item.id+'.jpg'} />{item.surname}, {item.name}</li> 
        });
      
        return (
            /* Modal */            
            <Modal visible={this.state.visible} onCancel={this.modalBackdropClicked} onClickBackdrop={this.modalBackdropClicked}>     
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"/>


            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel" >Sorteig de nadal</h5>
                    <button onClick={this.modalBackdropClicked} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div id="newDrawing" className="modal-body">
                    <div className="container-fluid">
                        <ol>
                            {listStudents}
                        </ol>
                    </div>
                </div>          
                                
           </div>
          
        </Modal>
    );
}
}

export default ShuffleModalPage;