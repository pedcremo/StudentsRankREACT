import React from 'react';
//import {events} from '../lib/eventsPubSubs.js';
import RankingListItemGradedTasksPage from './rankingListItemGradedTasksPage.js';

class RankingListItemPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            id:props.student[0],         
            student:props.student[1],           
            index:props.index,
            selected:false,
            checked:[]
        }; 
        this.handleCheckedChild=this.handleCheckedChild.bind(this);
    }

    componentWillReceiveProps(selectedAll) {
        if(this.state.selected==true){
            this.setState({selected: !this.state.selected});
            this.props.callbackFromParent({'option':'delete','id':this.state.id});
        }else{
            this.setState({selected: !this.state.selected});
            this.props.callbackFromParent({'option':'add','id':this.state.id});
        }
    }


    handleCheckedChild () {

        if(this.state.selected==true){
            this.setState({selected: !this.state.selected});
            this.props.callbackFromParent({'option':'delete','id':this.state.id});
        }else{
            this.setState({selected: !this.state.selected});
            this.props.callbackFromParent({'option':'add','id':this.state.id});
        }
    }

    
    render() {
        let index=0;
        const studentsGT = this.state.student.getStudentMarks().map((studentgt) =>
            <RankingListItemGradedTasksPage key={studentgt.id+studentgt.idStudent} studentgt={studentgt} idstudent={studentgt.idStudent}/>            
            
        );
        return (
            <tr className="js-rowStudent" >
            <td className="w-5" id="sorting"><h3><input id={"check"+this.state.id} checked={this.state.selected} type="checkbox" onChange={this.handleCheckedChild}/>{this.state.index}</h3></td> 
            <td className="w-35">
                <img className="profile" src={'src/server/data/fotos/' + this.state.id + '.jpg#' + new Date().getTime()} height="60" width="48"/>
                <a className="text-info" href={'#student/'+this.state.id}> {this.state.student.surname}, {this.state.student.name}</a>
            </td>
            <td className="w-60">
              <table id="scoreTable" className="table-condensed" width="100%">
               <tbody>
                <tr> 
                    <td className="w-20">        
                        <strong>{this.state.student.getFinalGrade()}</strong>
                    </td>
                    <td className="w-20">
                        {this.state.student.getXPtotalPoints()}
                    </td>
                    <td className="w-20">
                        {this.state.student.getGTtotalPoints()}
                    </td>
                    <td className="w-40 text-right">
                        <a href={'#addXP/'+this.state.id}>
                        <button className="btnS btn btn-primary">+XP</button></a>
                    </td>                    
                </tr> 
                </tbody> 
                <tbody className="tableGradedTasks" style={{display:'none'}}>                        
                    <tr>
                        {studentsGT}                        
                    </tr>
                </tbody> 
             </table>  
            </td>             
        </tr>
            
            
        );
    }
}

export default RankingListItemPage;
