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
            displayName:props.displayName,
            defaultTerm:props.defaultTerm,
            gtWeight:props.gtWeight,
            xpWeight:props.xpWeight,
            readOnly:props.readOnly ? true : false,
            searchFilter:"",
            searchmap:index,
            checkall:false,
            action:'-- Select one action --',
            selectedIds:props.selectedIds
        };                             
        this.handleClick=this.handleClick.bind(this);
        this.handleFilterBlur=this.handleFilterBlur.bind(this);
        this.searchEvent=this.searchEvent.bind(this);
        this.handleCheckedAll=this.handleCheckedAll.bind(this);
        this.updateSelectedList=this.updateSelectedList.bind(this);
        this.handleChange = this.handleChange.bind(this);
     
    }


    handleChange(event) {
        event.preventDefault();
        if(event.target.value == 'inverseSelection') {
            let arraySelecteds = this.state.students.filter((student) =>{
                if (this.state.selectedIds.indexOf(student[0])>=0) {
                    return false;
                }else{
                    return true;
                } 
            }).map((student) => {return student[0]});
           
            this.setState({
                selectedIds:arraySelecteds
            },function() {context.selectedIds = arraySelecteds});
        }else if(event.target.value != '-- Select one action --'){
            events.publish('/component/selectedAction',{'option':event.target.value,'arraySelecteds':this.state.selectedIds});
        }
        this.setState({action: '-- Select one action --'});
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
        event.preventDefault();
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
        //event.preventDefault();
        $('.tableGradedTasks').toggle();              
        if ($('.tableGradedTasks').is(':visible')) {       
          $('.fa-hand-o-right').addClass('fa-hand-o-down').removeClass('fa-hand-o-right');
          setCookie('expandedView','true',12);
        }else {     
          $('.fa-hand-o-down').addClass('fa-hand-o-right').removeClass('fa-hand-o-down');    
          setCookie('expandedView','false',12);    
        }
    }
    
    handleFilterBlur(event) {
        event.preventDefault();

        console.log('this.state.searchFilter = '+this.state.searchFilter);
        $(event.target).show();
    }

    searchEvent(event){
        event.preventDefault();
        const target = event.target;
        const filterString = target.type === 'checkbox' ? target.checked : target.value;
     
        this.setState({
            searchFilter: filterString,
            searchmap: this.state.students.filter( (idStudentPair) => {
                return idStudentPair[1].name.toLowerCase().indexOf(filterString.toLowerCase()) > -1 || idStudentPair[1].surname.toLowerCase().indexOf(filterString.toLowerCase()) > -1;
            })
        });
           
            /*if(this.state.searchFilter.length>value.length){
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
                searchFilter:value
            });*/ 
       
        
    }

    /*filterItems(query,array) {
        return array.filter(function(el) {
            let nameStudent=el[1];
            console.log(nameStudent);
            return nameStudent.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
    }*/
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
        console.log('RENDER RANKING_LIST_PAGE');
        const studentsItems = this.state.searchmap.map((student) => 
            <RankingListItemPage key={student[0]} index={student[2]} student={student} readOnly={this.state.readOnly}  updateSelectedListFromParent={this.updateSelectedList} selected={this.getIfSelected(student[0])} selectedAll={this.state.checkall} />            
        );  
        return (

            <table className="table table-striped ">
                <thead className="thead-dark" style={{backgroundColor:'#222529'}}>
                <tr className="d-flex text-white">
                    <th className="col-sm-1 mt-sm-2" >{!this.state.readOnly ?<input id="checkall" type="checkbox" onChange={this.handleCheckedAll}/>:null}&nbsp;&nbsp;<button id="more_gt" onClick={this.handleClick}><i className="fa fa-hand-o-right fa-1x"></i></button></th>
                    <th className="col-sm-2 mt-sm-2  d-none d-md-block" ><span className="small">{this.state.displayName} </span></th>
                    <th className="col-sm-3 mt-sm-1  d-none d-md-block"><input  className="form-control form-control-sm" type="text"  name="searchFilter"  onChange={this.searchEvent} onBlur={this.handleFilterBlur}/></th>
                    <th className="col-sm-2 mt-sm-2"><span className="small">{this.state.defaultTerm}</span> </th>
                    <th className="col-sm-4 text-right mt-sm-2"><span className="small">FG {parseInt(this.state.xpWeight)+parseInt(this.state.gtWeight)}% = XP {this.state.xpWeight}% + GT {this.state.gtWeight}% &nbsp;</span></th> 
                </tr>
                </thead>
                <tbody id="idTableRankingBody">
                     {studentsItems}             
                </tbody>
                {!this.state.readOnly ?
                    <tfoot>                    
                        <tr className="d-flex">
                            <th className="col-10">
                                <select value={this.state.action} onChange={this.handleChange}>
                                    <option value="-- Select one action --"> -- Select one action --</option>
                                    <option value="addXP"> Add XP</option>
                                    <option value="deleteall">Delete All Selected</option>
                                    <option value="inverseSelection">Inverse selection</option>
                                    <option value="sendmails">Send Email to All Selected</option>
                                </select>
                            </th>
                            <th colSpan="4"></th>                            
                        </tr>
                    </tfoot>
                :null}
            </table>
        );
    }
}

export default RankingListPage;
