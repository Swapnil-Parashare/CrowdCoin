import React, {Component} from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link,Router} from '../../../routes';
import Layout from  '../../../components/Layout';

class RequestNew extends Component {

    state = {
        description : '',
        value : '',
        recipient : '',
        loading : false,
        errorMessage : ''
    }

    static async getInitialProps(props){
        const address = props.query.address;
        return {address : address};
    }

    onInputChange1 = (event) => {
        this.setState({description : event.target.value});
    }
    onInputChange2 = (event) => {
        this.setState({value : event.target.value});
    }
    onInputChange3 = (event) => {
        this.setState({recipient : event.target.value});
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const {description,value,recipient} = this.state;

        this.setState({loading : true, errorMessage : ''});


        try{    
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value,'ether'), recipient)
                          .send({from : accounts[0]});
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        }catch(err){
            this.setState({errorMessage : err.message});
        }

        this.setState({loading : false});
    }

    render(){
        return(
            <Layout>
                <Link route = {`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a> 
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value = {this.state.description}
                            onChange = {this.onInputChange1}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in Ether</label>                        
                        <Input 
                            value = {this.state.value}
                            onChange = {this.onInputChange2}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            value = {this.state.recipient}
                            onChange = {this.onInputChange3}
                        />
                    </Form.Field>
                    <Message error header = "Oops" content = {this.state.errorMessage} />
                    <Button primary loading = {this.state.loading}>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;

/* Process :-
1] User writes something.
2] Event Handler is called.
3] State is changed.
4] Re-rendering occurs.
5] Input's value is changed.
 */