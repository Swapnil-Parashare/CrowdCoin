import React, {Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout'
import "semantic-ui-css/semantic.min.css";                           // This is for css styling of our semantic-ui-react components.
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router} from '../../routes';                                // Router : It allows us to redirect people from one page to another page inside our application. Here we are importing it from our "routes.js" file.



class CampaignNew extends Component{

    state = {
        minimumContribution : '',
        errorMessage : '',
        loading : false
    };

    onSubmit = async (event) => {
        
        event.preventDefault();                                                // This prevent's the default submission of our form.
        
        this.setState({loading:true, errorMessage : ""});                      // 1]'loading' = true     --> This property is required for "spinner" on the button.
                                                                               // 2] "errorMessage" : "" --> When user is trying for second time previous error message should not be continue to display.
        
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution)  // Calling "createCampaign()" function of our "Factory" contract.
                         .send({from : accounts[0]});
            
            Router.pushRoute('/');                                                 // After successfull "Campaign" creation we are re-directing our user to our "Home Page".
        }catch(err){
            this.setState({errorMessage : err.message});
        };

        this.setState({loading : false, value : ''});
    };

    onInputChange = (event) => {                                      // Here we are updating 'state' of our component equal to user's input.
        this.setState({minimumContribution : event.target.value});    // This will cause re-rendering.
    };                                                                // Ultimately <Input></Input> tag's "value" will be equal to 'state'.

    render(){
        return (
          <Layout>                                                                                                                      {/*Our Basic Layout */}
            <h3>Create a Campaign</h3>

            <Form onSubmit = {this.onSubmit} error={!!this.state.errorMessage}>                                                          {/*Whenever our user's clicks on "Create!" button, this event handler is called. */} {/*Due to that "error" our error message is not visible as default, but when something went wrong it is visible. */}
                <Form.Field>                                                                                                             {/*Property "error" is for making our error visible on screen, initally empty string = false so no error is visible, when state is modified error is visible. */}
                    <label>Minimum Contribution</label>
                    <Input
                     label = "wei" 
                     labelPosition = "right"
                     value = {this.state.minimumContribution}                                            // We want our user's input eventually equal to this 'value'. 
                     onChange = {this.onInputChange}                                                     // Here we have attached our event handler, whenver user input's something this event handler is called.
                     />
                </Form.Field>
                <Message error header = "Oops!" content = {this.state.errorMessage} />                   {/* This is for displaying "Error Message", again it is "semantic-ui-react" component : "Message". */}
                <Button loading = {this.state.loading} primary>                                          {/* "loading" property ----> "spinner" , "primary" ----> Blue color*/}
                     Create!                                                                             {/* "Create!" button is present inside "Form" component for "semantic-ui-react", it is used for submitting the 'Form' */}
                </Button>
            </Form>
          </Layout>
        );
    };
}

export default CampaignNew;