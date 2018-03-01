import React from 'react';
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
            search:"",
            searchmap:index,
            checkall:false,
            action:'-- Select one action --',
            selected:[]
        };                             
        this.handleClick=this.handleClick.bind(this);
        this.search=this.search.bind(this);
        this.handleChecked=this.handleChecked.bind(this);
        this.myCallback=this.myCallback.bind(this);
        this.handleChange = this.handleChange.bind(this);
     
    }


    handleChange(event) {
        this.setState({action: event.target.value});

        if(event.target.value!='-- Select one action --'){
            events.publish('/component/selectedAction',{'option':event.target.value,'arraySelecteds':this.state.selected});
        }
    }


    
    myCallback(datafromchild){

        let arraySelecteds= this.state.selected;
        let actualid=datafromchild.id;

        console.log(this.state.selected);

        if(arraySelecteds.length==0){

            if(datafromchild.option=='add'){
                arraySelecteds.push(datafromchild.id);
            }

        }else{

            if(datafromchild.option=='add'){
                //Variable to control if that selected student already exist in our array
                let exist= false;
                arraySelecteds.forEach(function(studentid){
                    if (studentid == actualid){
                        exist=true;
                    }
                })
                if(exist==false){
                    arraySelecteds.push(actualid);
                }
            }else{

                arraySelecteds.forEach(function(studentid,index){
                    if (studentid == actualid){
                        arraySelecteds.splice(index,1);
                    }
                }) 
            }
        }
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


    handleChecked (event) {
        if(this.state.checkall==false){
            this.setState({checkall:true});
        }else{
            this.setState({checkall:false});
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
        this.setState({
            searchmap: newMapStudent,
            search: value
        });
    }


    filterItems(query,array) {
        return array.filter(function(el) {
            let nameStudent=el[1];
            return nameStudent.indexOf(query.toLowerCase()) > -1;
        })
    }


    
    render() {
  
        let cont =1;
        const studentsItems = this.state.searchmap.map((student) =>
            <RankingListItemPage key={student[0]} callbackFromParent={this.myCallback} selectedAll={this.state.checkall} index={student[2]} student={student} />            
        ); 
        return (
            <table className="table table-striped table-condensed">
                <thead className="thead-dark">
                <tr>
                    <th><input id="checkall" type="checkbox" onChange={this.handleChecked}/> Select All &nbsp;&nbsp;&nbsp;&nbsp;<a href="#expandedView" id="expandedView" onClick={this.handleClick}><button id="more_gt"><i id="expandedViewIcon" className="fa fa-hand-o-right fa-1x"></i></button></a></th>
                    <th><input type="text"  className="form-control" id="idFirstName" name="search" value={this.state.search} onChange={this.search} /></th>        
                    <th>FG 100% = XP {this.state.xpWeight}% + GT {this.state.gtWeight}%</th>
                </tr>
                </thead>
                <tbody id="idTableRankingBody">
                    {studentsItems}               
                </tbody>
                <thead>
                    <tr>
                        <th><select value={this.state.action} onChange={this.handleChange}>
                            <option value="-- Select one action --"> -- Select one action --</option>
                            <option value="deleteall">Delete All Selected</option>
                            <option value="sendmails">Send Email to All Selected</option>
                        </select></th><th/><th/>
                    </tr>
                </thead>
            </table>
        );
    }
}

export default RankingListPage;
