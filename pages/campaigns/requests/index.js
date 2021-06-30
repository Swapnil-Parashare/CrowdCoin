import React, {Component} from 'react';
import { Button, Table } from 'semantic-ui-react';
import {Link} from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props){
        const address = props.query.address;
        const campaign = Campaign(address);                                               // Here we are creating an instance of our deployed campaign, inorder to interact with it.
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(                                               // Here we are fetching all our requests one by one.
            Array(parseInt(requestCount))
                .fill()
                .map((element,index) => {
                    return campaign.methods.requests(index).call();
                })
        );
        return {address : address, requests : requests, requestCount : requestCount, approversCount : approversCount};
    }

    renderRows() {                                                                          // This is the helper function which will help us to render all the rows one by one.
        return this.props.requests.map((request,index) => {
            return <RequestRow 
                        key = {index}
                        id = {index}
                        request = {request}
                        address = {this.props.address}
                        approversCount = {this.props.approversCount}
                  />;
        })
    }

    render(){

        const {Header,Row,HeaderCell,Body} = Table;

        return(
            <Layout>
                <h3>Request List</h3>     
                <Link route = {`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated = "right" style = {{marginBottom : 10}}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>ApprovalCount</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests.</div>
            </Layout>
        );
    }
}

export default RequestIndex;

/* Process :-
1] Here we are supposed to fetech all the requests of our campaign and display it on the table.
2] Our "request" is a structure and we have stored it in an array.
3] Now in solidity we cannot return an "Array of Structure".
4] So here we need to make seprate function call for each request and fetch one request at a time.
5] In this way we are fetching request one by one.

Fetching Requests :-
1] Array(3).fill() ----> 0,1,2 
2] Array(5).fill() ----> 0,1,2,3,4      
3] So this code basically returns an array of all valid indexes.
4] Now we are use map function on this array.
5] We will take each valid index, make a function call to our 'campaign contract', then we will fetch our 'request'(one at a time).
6) In this way we will fetch requests one by one by taking all the valid indexes from the array.
7) All these requests will be stored in form of array inside variable "requests".


*/