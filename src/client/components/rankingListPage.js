import React from 'react';
import {context} from '../context.js'; //Singleton
import {events} from '../lib/eventsPubSubs.js';
import RankingListItemPage from './rankingListItemPage.js';
import {setCookie,getCookie} from '../lib/utils.js';

class RankingListPage extends React.Component {
    constructor(props){
        super(props);        

        let student=props.students;
        let index=[];
        let cont=1;
        student.map((student) =>
        index.push([student[0],student[1],cont++])
        );

        this.state = {                
            students:index,           
            gtWeight:props.gtWeight,
            xpWeight:props.xpWeight,
            readOnly:props.readOnly ? true : false,
            search:"",
            searchmap:index,
            checkall:false,
            action:'-- Select one action --',
            selectedIds:props.selectedIds
        };                             
        this.handleClick=this.handleClick.bind(this);
        this.search=this.search.bind(this);
        this.handleCheckedAll=this.handleCheckedAll.bind(this);
        this.updateSelectedList=this.updateSelectedList.bind(this);
        this.handleChange = this.handleChange.bind(this);
     
    }


    handleChange(event) {
        this.setState({action: event.target.value});
        if(event.target.value == 'inverseSelection') {
            let arraySelecteds = this.state.students.filter((student) =>{
                if (this.state.selectedIds.indexOf(student[0])) {
                    return false;
                }else{
                    return true;
                } 
            }).map((student) => {return student[0]});
            debugger;
            this.setState({
                selectedIds:arraySelecteds
            },function() {context.selectedIds = arraySelecteds});
        }else if(event.target.value != '-- Select one action --'){
            events.publish('/component/selectedAction',{'option':event.target.value,'arraySelecteds':this.state.selectedIds});
        }
    }


    updateSelectedList(datafromchild) {        
        let arraySelecteds= this.state.selectedIds;
        let actualid=datafromchild.id;
              
        //Id not exists        
        if (arraySelecteds.indexOf(datafromchild.id) < 0) {
            if (datafromchild.option=='add') arraySelecteds.push(datafromchild.id);
        //id exists
        }else {
            if (datafromchild.option=='delete')
            arraySelecteds.splice(arraySelecteds.indexOf(datafromchild.id),1);
        }     
        this.setState({
            selectedIds:arraySelecteds
        },function() {context.selectedIds = arraySelecteds});//Mantain the context because if we mount an umont we lose selecteds
        
    }


    componentDidMount() {
        this.subscription = events.subscribe('students/change',(obj) => {  
            let index=[];
            let cont=1;
            obj.map((student) =>
                index.push([student[0],student[1],cont++])
            );          
            this.setState({
                students: index
            });                 
        });
        if (getCookie('expandedView')==='true') this.handleClick(null);
    }

    componentWillUnmount() {
        this.subscription.remove();
    }


    handleCheckedAll (event) {
        
        if(this.state.checkall==false){
            let arraySelecteds = []; 
            this.setState({checkall:true},function(){
                arraySelecteds = this.state.students.map((student) => { 
                           
                    return student[0];
                }); 
                this.setState({selectedIds:arraySelecteds},function(){
                    context.selectedIds=arraySelecteds;                   
                    //this.forceUpdate();
                })
            });
        }else{
            this.setState({checkall:false},function(){
                this.setState({selectedIds:[]},function(){
                    context.selectedIds=[];                    
                    //this.forceUpdate();
                })
            });
        }  
        
    }


    handleClick(event) {        
        $('.tableGradedTasks').toggle();              
        if ($('.tableGradedTasks').is(':visible')) {       
          $('.fa-hand-o-right').addClass('fa-hand-o-down').removeClass('fa-hand-o-right');
          setCookie('expandedView','true',12);
        }else {     
          $('.fa-hand-o-down').addClass('fa-hand-o-right').removeClass('fa-hand-o-down');    
          setCookie('expandedView','false',12);    
        }
    }
    
    search(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let studentName=[];
        let newMapStudent=[];

        this.setState({
            [name]: value
        }); 
        if(this.state.search.length>value.length){
            this.state.students.map((student) =>
                studentName.push([student[0],student[1].surname+", "+student[1].name,student[1],student[2]])
            );
        }else{
            this.state.searchmap.map((student) =>
                studentName.push([student[0],student[1].surname+", "+student[1].name,student[1],student[2]])
            );
        }
        
        studentName=this.filterItems(value,studentName);
        studentName.map((student) =>
            newMapStudent.push([student[0],student[2],student[3]])
        );
        console.log(studentName);
        this.setState({
            searchmap: newMapStudent,
            search: value
        });
    }

    filterItems(query,array) {
        return array.filter(function(el) {
            let nameStudent=el[1];
            console.log(nameStudent);
            return nameStudent.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
    }
    getIfSelected(idStudent) {
       
        if (this.state.checkall) return true;
        else {
            if (this.state.selectedIds.indexOf(idStudent) >=0){
                return true
            }else{
                return false
            }
        }       
    }

    render() {
        const studentsItems = this.state.searchmap.map((student) => 
            <RankingListItemPage key={student[0]} index={student[2]} student={student} readOnly={this.state.readOnly}  updateSelectedListFromParent={this.updateSelectedList} selected={this.getIfSelected(student[0])} selectedAll={this.state.checkall} />            
        );  
        return (
            <table className="table table-striped ">
                <thead className="thead-dark">
                <tr className="d-flex vertical-center">
                    <th height="35" className="col-1">{!this.state.readOnly ?<input id="checkall" type="checkbox" onChange={this.handleCheckedAll}/>:null}&nbsp;&nbsp;<button id="more_gt" onClick={this.handleClick}><i className="fa fa-hand-o-right fa-1x"></i></button></th>
                    <th height="35" className="col-5"><input type="text"  id="idFirstName" name="search" value={this.state.search} onChange={this.search} /></th>
                    <th height="35" className="col-6 text-right"><span className="small">FG 100% = XP {this.state.xpWeight}% + GT {this.state.gtWeight}% &nbsp;</span></th> 
                </tr>
                </thead>
                <tbody id="idTableRankingBody">
                     {studentsItems}               
                </tbody>
                {!this.state.readOnly ?
                    <tfoot>                    
                        <tr>
                            <th>
                                <select value={this.state.action} onChange={this.handleChange}>
                                    <option value="-- Select one action --"> -- Select one action --</option>
                                    <option value="deleteall">Delete All Selected</option>
                                    <option value="inverseSelection">Inverse selection</option>
                                    <option value="sendmails">Send Email to All Selected</option>
                                </select>
                            </th>
                            <th/><th/>
                        </tr>
                    </tfoot>
                :null}
            </table>
        );
    }
}

export default RankingListPage;
