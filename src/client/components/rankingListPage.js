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
            searchmap:index
        };                             
        this.handleClick=this.handleClick.bind(this);
        this.search=this.search.bind(this);

        console.log(this.state.students);
        
    }

    componentDidMount() {
        this.subscription = events.subscribe('students/change',(obj) => {  
            //debugger;          
            this.setState({
                students: obj
            });                 
        });
        if (getCookie('expandedView')==='true') this.handleClick(null);
    }

    componentWillUnmount() {
        this.subscription.remove();
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
        console.log(this.state.students);
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
            return nameStudent.indexOf(query.toLowerCase()) > -1;
        })
    }

    render() {
        const studentsItems = this.state.searchmap.map((student) =>
            <RankingListItemPage key={student[0]} index={student[2]} student={student} />            
        );  
        return (
            <table className="table table-striped table-condensed">
                <thead className="thead-dark">
                <tr>
                    <th><a href="#expandedView" onClick={this.handleClick}><button id="more_gt"><i className="fa fa-hand-o-right fa-1x"></i></button></a></th>
                    <th><input type="text"  id="idFirstName" name="search" value={this.state.search} onChange={this.search} /></th>
                    <th>FG 100% = XP {this.state.xpWeight}% + GT {this.state.gtWeight}%</th> 
                </tr>
                </thead>
                <tbody id="idTableRankingBody">
                    {studentsItems}               
                </tbody>
            </table>
        );
    }
}

export default RankingListPage;
