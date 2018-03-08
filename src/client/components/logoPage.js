import React from 'react';
import T from 'i18n-react';
import Settings from '../classes/settings.js';
import {events} from '../lib/eventsPubSubs.js';

class LogoPage extends React.Component {
    constructor(props){
        super(props);
        //T.setTexts(Settings.getTraductedText(), { MDFlavor: 0 });        
        T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
        this.state = {                
          motto:T.translate("motto")    
        };       
    }    
    componentDidMount() {
        this.subscription = events.subscribe('settings/change',(obj) => {  
            //T.setTexts(Settings.getTraductedText(), { MDFlavor: 0 })
            T.setTexts(require('../lib/i18n/' + Settings.getLanguage() + '.json'))
            this.setState({
                motto:T.translate("motto")     
            });               
        });      
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    render() {               
        return (
            <span>
            <a className="navbar-brand" href="#home"><h2><i className="fa fa-cubes"></i>&nbsp;+x<strong>BRAIN</strong></h2></a>
            <p className="watchword d-none d-md-block">{this.state.motto}</p>            
            </span>
        );
    }
}

export default LogoPage;
