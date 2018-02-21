import React from 'react';

class FooterPage extends React.Component {
    constructor(props){
        super(props);       
    }

    render() {        
        return (
            <div className="jumbotron footer-copyright py-3 text-center">
            <div className="container-fluid">
            <span className="copyleft">&copy;</span> Copyleft 2018  &emsp;&emsp;<i className="fa fa-github"></i><a className="text-success" href="https://github.com/pedcremo/StudentsRank"> https://github.com/pedcremo/StudentsRank </a>    
            </div>
        </div>         
        );
    }
}

export default FooterPage;
