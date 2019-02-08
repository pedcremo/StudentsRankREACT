import React from 'react';
import {context} from '../../context.js'; //Singleton
import {events} from '../../lib/eventsPubSubs.js';
import RankingListItemPage from './rankingListItemPage.js';
import {setCookie,getCookie} from '../../lib/utils.js';
import Settings from '../../classes/settings.js';
import T from 'i18n-react';


class RankingListPage extends React.Component {
    constructor(props){
        super(props);        

        let studentsIndexed = props.students.map((student,index) => {
            return [student[0],student[1],++index];            
        });

        this.state = {                
            students:studentsIndexed, 
            displayName:props.displayName,           
            settings:props.settings,
            expandedView:(getCookie('expandedView')==='true'),
            readOnly:props.readOnly ? true : false,
            searchFilter:"",
            searchmap:studentsIndexed,
            checkall:false,
            action:'-- Select one action --',
            selectedIds:props.selectedIds
        };   

        T.setTexts(require('../../lib/i18n/' + Settings.getLanguage() + '.json'));
        this.handleClick=this.handleClick.bind(this);
        this.handleFilterBlur=this.handleFilterBlur.bind(this);
        this.searchEvent=this.searchEvent.bind(this);
        this.handleCheckedAll=this.handleCheckedAll.bind(this);
        this.updateSelectedList=this.updateSelectedList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSettingsChange = this.handleSettingsChange.bind(this);
     
    }

    handleSettingsChange(event) {
        
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        let newSettings = this.state.settings;
        newSettings[name] = value;
       
        this.setState({
            settings:newSettings
        },function() {
            events.publish('dataservice/saveSettings',this.state.settings);
            events.publish('settings/change',this.state.settings);            
        });
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
        
        if (this.state.expandedView) $('.tableGradedTasks').show();                          
        else $('.tableGradedTasks').hide()

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
        //event.preventDefault();
        
        if(this.state.checkall==false){
            let arraySelecteds = this.state.students.map((student) => {                           
                return student[0];
            });  
            context.selectedIds=arraySelecteds;            
            this.setState({
                "checkall":true,
                "selectedIds":arraySelecteds            
            });
        }else{
            context.selectedIds=[];                  
            this.setState({
                "checkall":false,
                "selectedIds":[]
            });
        }       
    }

    handleClick(event) {     
        //event.preventDefault();
        if (this.state.expandedView) {
            $('.tableGradedTasks').hide();  
            setCookie('expandedView','false',12);            
            $('.fa-hand-o-down').addClass('fa-hand-o-right').removeClass('fa-hand-o-down');
        }else{
            setCookie('expandedView','true',12);
            $('.tableGradedTasks').show();  
            $('.fa-hand-o-right').addClass('fa-hand-o-down').removeClass('fa-hand-o-right');
        }
        this.setState({
            "expandedView":!this.state.expandedView
        });
      
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
        //console.log('RENDER RANKING_LIST_PAGE');
        ;

        const studentsItems = this.state.searchmap.map((student) => 
            <RankingListItemPage key={student[0]} index={student[2]} student={student} settings={this.state.settings} readOnly={this.state.readOnly}  updateSelectedListFromParent={this.updateSelectedList} selected={this.getIfSelected(student[0])} selectedAll={this.state.checkall} />            
        );  
        
        return (

            <table className="table table-striped ">

            
                <thead className="thead-dark" style={{backgroundColor:'#222529'}}>
                <tr className="d-flex text-white">
                    <th className="col-sm-1 mt-sm-2" >{!this.state.readOnly ?<input id="checkall" type="checkbox" defaultChecked={this.state.checkall} onChange={this.handleCheckedAll}/>:null}&nbsp;&nbsp;<button id="more_gt" onClick={this.handleClick}><i className="fa fa-hand-o-right fa-1x"></i></button></th>
                    <th className="col-sm-2 mt-sm-2  d-none d-md-block" ><span className="small font-weight-bold">{this.state.displayName} </span></th>
                    <th className="col-sm-3 mt-sm-1  d-none d-md-block"><input  className="form-control form-control-sm" type="text"  name="searchFilter"  placeholder={T.translate("rankingListFilter")} onChange={this.searchEvent} onBlur={this.handleFilterBlur}/></th>
                    <th className="col-sm-2 mt-sm-1">
                        
                        {!this.state.readOnly ? <select className="form-control form-control-sm"  name="defaultTerm" value={this.state.settings.defaultTerm} id="termsItems" onChange={this.handleSettingsChange} >
                                            {this.state.settings?this.state.settings.terms.map((term, i) =>
                                            <option key={i} value={term.id}>{term.name}</option>
                                            ):null}                                            
                                            <option key='all' value="ALL">ALL</option>
                                        </select> : <span className="small">{this.state.settings.defaultTerm}</span> } 
                    
                    </th>
                    <th className="col-sm-4 text-right mt-sm-2"><span className="small font-weight-bold">FG {parseInt(this.state.settings.weightXP)+parseInt(this.state.settings.weightGP)}% = € {this.state.settings.weightXP}% + GT {this.state.settings.weightGP}% &nbsp;</span></th> 
                </tr>
                </thead>   
                <tbody id="idTableRankingBody">
                        <tr className="d-flex">
                            <th className="col-10">
                                <select className="form-control form-control-sm mt-sm-2 mr-sm-2" value={this.state.action} onChange={this.handleChange}>
                                    <option value="-- Select one action --"> {T.translate("rankingListSelectAction")}</option>
                                    <option value="addXP"> {T.translate("rankingListAddXP")}</option>
                                    <option value="deleteall">{T.translate("rankingListDeleteSelected")}</option>
                                    <option value="inverseSelection">{T.translate("rankingListInverseSelected")}</option>
                                    <option value="sendmails">{T.translate("rankingListEmailSelected")}</option>
                                </select>
                            </th>
                            <th colSpan="4"></th>                            
                        </tr>
                    
                
                     {studentsItems}             
                </tbody>
                {!this.state.readOnly ?
                    <tfoot>                    
                        <tr className="d-flex">
                            <th className="col-10">
                                <select className="form-control form-control-sm mt-sm-2 mr-sm-2" value={this.state.action} onChange={this.handleChange}>
                                    <option value="-- Select one action --"> {T.translate("rankingListSelectAction")}</option>
                                    <option value="addXP"> {T.translate("rankingListAddXP")}</option>
                                    <option value="deleteall">{T.translate("rankingListDeleteSelected")}</option>
                                    <option value="inverseSelection">{T.translate("rankingListInverseSelected")}</option>
                                    <option value="sendmails">{T.translate("rankingListEmailSelected")}</option>
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
