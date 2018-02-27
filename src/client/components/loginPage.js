import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            username: '',
            password: '',
            code:''
        };        
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

                <div className="row omb_row-sm-offset-3 omb_socialButtons">                       
                    <div className="col-xs-12 col-sm-6">
                        <a target="_self" href="api/loginGoogle" className="btn btn-block btn-social btn-google">
                            <span className="fa fa-google"></span>Sign in using iestacio.com
                        </a>
                    </div>          
                </div> 
                <div className="row omb_row-sm-offset-3">
                    <div className="col-xs-12 col-sm-6" styles="margin-top:30px">
                        <form id="loginForm" className="omb_loginForm" autoComplete="off">
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                <input type="text" className="form-control"  name="username" placeholder="email address" value={this.state.username} onChange={this.handleInputChange}/>
                            </div>
                            <span className="help-block"></span>

                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                <input  type="password" className="form-control" name="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange}/>
                            </div>
                            <span   className="help-block"></span><br/>
                            <span id="loginAlert" className="text-danger">User or password error. Bad Credentials!</span>                        
                            <button className="btn btn-lg btn-primary btn-block"  onClick={this.handleSubmit} >Login</button><br/>
                        </form>
                    </div>
                </div>
                <div className="row omb_row-sm-offset-3">
                </div>
            </div>
            </div>
            <div class="row">
                    <div class="col-sm-4 offset-sm-2">
                        <form id="loginForm" className="omb_loginForm" autoComplete="off" onSubmit={this.handleSubmitCode}>
                            <div className="input-group">
                                <span className="input-group-addon">Insert Code: </span>
                                <input type="text" name="code" className="form-control" onChange={this.handleInputChange}/>
                            </div>                     
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Enter</button><br></br>
                        </form>
                    </div>
                </div>
        </div>
            
        );
    }
}

export default LoginPage;
