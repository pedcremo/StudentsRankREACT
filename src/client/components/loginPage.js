import React from 'react';
import {events} from '../lib/eventsPubSubs.js';
import T from 'i18n-react';
import Settings from '../classes/settings.js';

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            username: '',
            password: '',
            //traductions: T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json')),
            code:''
        };   
        T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'));     
        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);      
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {       
        event.preventDefault();
        events.publish('context/login',this.state);        
    }
    handleSubmitCode(event) {
        event.preventDefault();
        events.publish('context/loginCode',this.state.code);
    }
    render() {
        
        return (
        <div  className="login-intro" >
            <div className="widget container">

            <div className="omb_login">

                <div align="center">                       
                    <div className="col-xs-12 col-sm-6">
                        <a target="_self" href="api/loginGoogle" className="btn btn-block btn-social btn-google">
                        <h5> {T.translate("AsTeacher")}</h5>
                            <span className="fa fa-google"></span> {T.translate("SigninUsing")} iestacio.com
                        </a>
                    </div>          
                </div> 
                <hr className="hr-text" data-content={T.translate("loginOR")} />
                <div align="center">
                <h5> {T.translate("AsStudent")}</h5>
                    <div className="col-xs-12 col-sm-6" styles="margin-top:30px">
                  
                        <form id="loginForm" className="omb_loginForm" autoComplete="off" onSubmit={this.handleSubmitCode}>
                           
                            <span className="help-block"></span>

                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                <input  type="text" className="form-control" name="code" placeholder={T.translate("loginCodeToEnroll")} onChange={this.handleInputChange}/>
                            </div>
                            <span   className="help-block"></span><br/>
                            <span id="loginAlert" className="text-danger">{T.translate("passwordError")}</span>                        
                            <button className="btn btn-lg btn-primary btn-block" type="submit">{T.translate("login")}</button><br/>
                        </form>
                    </div>
                </div>
                <div className="row omb_row-sm-offset-3">
                </div>
            </div>
            </div>
            {/* <div class="row">
                    <div class="col-sm-4 offset-sm-2">
                        <form id="loginForm" className="omb_loginForm" autoComplete="off" onSubmit={this.handleSubmitCode}>
                            <div className="input-group">
                                <span className="input-group-addon">Insert Code: </span>
                                <input type="text" name="code" className="form-control" onChange={this.handleInputChange}/>
                            </div>                     
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Enter</button><br></br>
                        </form>
                    </div>
                </div> */}
        </div>
            
        );
    }
}

export default LoginPage;
