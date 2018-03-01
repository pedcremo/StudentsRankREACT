import React from 'react';
import T from 'i18n-react';
import Settings from '../classes/settings.js';

class LogoPage extends React.Component {
    constructor(props){
        super(props);       
        let messages = Settings.getTraductedText();
        T.setTexts(messages, { MDFlavor: 0 });    
    }    
   
    render() {        
        return (
            <span>
            <a className="navbar-brand" href="#home"><h2><i className="fa fa-cubes"></i>&nbsp;+x<strong>BRAIN</strong></h2></a>
            <p className="watchword">{T.translate("motto")}</p>            
            </span>
        );
    }
}

export default LogoPage;
