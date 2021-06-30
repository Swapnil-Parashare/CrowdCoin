import React, {Component} from 'react';
import {Form , Input, Button,Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';                               // 1]Here we can get campaign instance by giving its 'address'.
import web3 from '../ethereum/web3';                                       // 2]'address' is available as it is send as 'props' from "show.js" to our "ContributeForm.js"
import {Router} from '../routes'

class ContributeForm extends Component {
    
    state = {
        value : '',
        errorMessage : '',
        loading : false
    }
    
    onInputChange = (event) => {
        this.setState({value : event.target.value});
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading : true, errorMessage : ''});

        const campaign = Campaign(this.props.address);                       // Here we have successfully created instance of our deployed campaign.
        
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from : accounts[0],
                value : web3.utils.toWei(this.state.value, 'ether')
            });

            Router.replaceRoute(`/campaigns/${this.props.address}`);          // This is for refreshing our page so that we can see updated data as soon as we contribute.
        }catch(err){
            this.setState({errorMessage : err.message});
        }

        this.setState({loading : false, value : ''});


    }

    render(){
        return(
            <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                      value = {this.state.value}
                      onChange = {this.onInputChange}
                      label = "ether"
                      labelPosition = "right"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage}/>
                <Button primary loading = {this.state.loading}>
                    Contribute!
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;

/*
Aim : This component allows user to contribute in a particular campaign.

Note :-
1] Our show.js knows which deployed contract user is looking at, by tracing the address present in url.[ getinitialProps(props) --->props.query.address].
2] Our ContributeForm.js should also know the address as we want to send money to particular campaign.
3] IMP :- 'address' is only accessible in "show.js" and not in "ContributeForm.js" because we have set this thing in "routes.js" and have told "server.js" to make server listen to "routes.js".
4] Hence we need to export it from "show.js" and import it here i.e "ContributeForm.js".
5] 'address' is avaialable in "ContributeForm.js" as "props". As we have set this thing in "show.js" while rendering.
6] "Error Handling" and "Spinner" are same as "new.js".
*/