import React from 'react';

class I18nPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
        };        
        //this.handleInputChange = this.handleInputChange.bind(this);   
        //this.handleSubmit = this.handleSubmit.bind(this);      
    }

    // handleInputChange(event) {
    //     const target = event.target;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     const name = target.name;
        
    //     this.setState({
    //       [name]: value
    //     });
    // }

    // handleSubmit(event) {       
    //     event.preventDefault();
    //     events.publish('context/login',this.state);        
    // }

    render() {
        
        return (
        <div>
           <h3>i18n Proves</h3>
        </div>
            
        );
    }
}

export default I18nPage;