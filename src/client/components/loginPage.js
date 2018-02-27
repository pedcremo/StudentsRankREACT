import React from 'react';
import {events} from '../lib/eventsPubSubs.js';

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
            username: '',
            password: ''
        };        
        this.handleInputChange = this.handleInputChange.bind(this);   
        this.handleSubmit = this.handleSubmit.bind(this);      
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

    render() {
        
        return (
        <div  className="login-intro" >
            <div className="widget container">

            <div className="omb_login">

                <div align="center">                       
                    <div className="col-xs-12 col-sm-6">
                        <a target="_self" href="api/loginGoogle" className="btn btn-block btn-social btn-google">
                        <h3> As Teacher</h3>
                            <span className="fa fa-google"></span>Sign in using iestacio.com
                        </a>
                    </div>          
                </div> 
                <hr className="hr-text" data-content="OR"/>
                <div align="center">
                <h3> As Student</h3>
                    <div className="col-xs-12 col-sm-6" styles="margin-top:30px">
                  
                        <form id="loginForm" className="omb_loginForm" autoComplete="off">
                           
                            <span className="help-block"></span>

                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                <input  type="number" className="form-control" name="code" placeholder="Class code to enroll"/>
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
        </div>
            
        );
    }
}

export default LoginPage;
