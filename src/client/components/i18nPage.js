import React from 'react';
import T from 'i18n-react';
import { MDText } from 'i18n-react'; // Singleton

class I18nPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {                
        };        
        //this.handleInputChange = this.handleInputChange.bind(this);   
        //this.handleSubmit = this.handleSubmit.bind(this);
        T.setTexts({
            first: "Hello, World! My name is *{myName}*!",
            second:  "How do you do? *{example}*"
        }, { MDFlavor: 0 });

        let messages = {
            headerTitle: "Students Rank",
            headerSubtitle: "The harder you work, the luckier you get"
        };
        
        this.traductor = new MDText(messages);
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
           <T.p text={{ key: "first", myName: "Gonzalo"}} />
           <h1>{T.translate("second", { example: "gtormo" })}</h1>
           <p/>

           <this.traductor.span text="headerTitle" />
        </div>
            
        );
    }
}

export default I18nPage;