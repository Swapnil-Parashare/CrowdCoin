import React, {Component} from 'react';
import { Card , Grid, Button} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';                           // To get instance of our deploed "Campaign".
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';

class CampaignShow extends Component {
    
    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);                   // 'address' property is set inside 'routes.js. Here we are creating an instance of "campaign" deployed by user to fetch some details from it.
        const summary = await  campaign.methods.getSummary().call();      // Fetching details from user deployed contract.
        return {
            address : props.query.address,
            minimumContribution : summary[0],
            balance : summary[1],
            requestsCount : summary[2],
            approversCount : summary[3],                                  // Our "React Component" :- "CampaignShow" will receive this whole object as "props".
            manager : summary[4]
        };
    }
    
    renderCards() {
        const {
            balance ,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props ;

        const items = [
            {
                header : manager,
                meta : 'Address of Manager',
                description : 'Manager created this campaign and can create request to withdraw money.',
                style : {overflowWrap : 'break-word'}
            },
            {
                header : minimumContribution,
                meta : 'Minimum Contribution (wei)',
                description : 'You must contribute at least this much wei to become an approver'
            },
            { 
                header : requestsCount,
                meta : 'Number of Requests',
                description : 'A request tries to withdraw money from the contract. Request must be approved by approvers.'     
            },
            {
                header : approversCount,
                meta : 'Number of Approvers',
                description : 'Number of people who have already donated to this campaign'
            },
            {
                header : web3.utils.fromWei(balance, 'ether'),
                meta : 'Campaign Balance (ether)',
                description : 'Balance is how much money this campaign has left to spend.'
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width = {10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width = {6}>
                            <ContributeForm address = {this.props.address}/>                      {/* Whatever getInitialProps() returns is avaialable to our "react-component" as "props", hence we can access "address" property. */}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route = {`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>    
            </Layout>
        );
    }
}

export default CampaignShow;

/*
1] getInitialProps() method is executed before our actual react component is rendered.
2] Whatever this "getInitialProps()" returns is available as "props" to our "react-component".
3] This getInitialProps() has its own "props".
4] Through this 'props' we can get access to "address" of deployed contract which is present in the 'url'.
5] We have set this "address" parametre in "routes.js" file.
*/