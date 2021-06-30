const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;                                                                                      // Reference to deployed instance of 'factory'.
let campaignAddress;                                                                              // 'Campaign' contract is deployed using 'factory'. This is address of that.
let campaign;                                                                                     // Reference to deployed instance of 'campaign'.

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth
    .Contract(JSON.parse(compiledFactory.interface))                                                 // ".Contract()" constructor is part of "web3.eth" library. Here we pass our 'interface'.
    .deploy({ data: compiledFactory.bytecode })                                                      // ".deploy()" for deploying the contract. Here we pass our "Bytecode".
    .send({ from: accounts[0], gas: 1000000 });                                                      // ".send()" is for actually sending transaction to the network. Here we send our deployment transaction.
                                                                                                     //  It takes the account address from which transaction should be sent and "value" i.e gas ammount user is willing to spend for transaction.

  await factory.methods.createCampaign("100").send({                                                 // 1]We are using "createCampaing()" method of the deployed instance of our contract "CampaignFactory".
    from: accounts[0],                                                                               // 2]We use it for creating a "Campaign" i.e we are deploying our contract "Campaign". 
    gas: "1000000",
  });

  const addresses = await factory.methods.getDeployedCampaigns().call();                             // 1]We are using "getDeployedCampaigns()" method of "CampaignFactory" contract to fetch the array of deployed contract's addresses.
  campaignAddress = addresses[0];                                                                    // 2]As here we have only one "Campaign" contract deployed, therefore [0].

  campaign = await new web3.eth.Contract(                                                             // 1]Here we are not deploying a new contract.
    JSON.parse(compiledCampaign.interface),                                                           // 2]We just want to interact with already deployed contract.
    campaignAddress                                                                                   // 3]Hence we are only giving our contracts interface and address were our contract is deployed.
  );
  
})               

describe('Campaigns', () => {
   
    it('Test1 : Successfull Deployment of Factory and Campaign',() => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Test2 : Transaction\'s Sender confirmed as Manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);                                         //(expectation,reality)
    });

    it('Test3 : Contributers are added as Approvers' , async () => {
        
        await campaign.methods.contribute().send({   // Contribution is done.
            value : '200',
            from : accounts[1]
        })

        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);                         // Checking weather address is added in contributers list.
    });

    it('Test4 : Minimum Contribution condition verified', async () => {
        try{
            await campaign.methods.contribute().send({
              value: "51",
              from : accounts[2]
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('Test5 : Manager has the ability to create the test', async () => {
        
        await campaign.methods
        .createRequest('Testing Purpose', '100', accounts[8])
        .send({
            from : accounts[0],   // Manager
            gas : '1000000'
        });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Testing Purpose', request.description);
    });

    it('Test6 : End to End Testing', async () => {

        await campaign.methods                                                                          // 1] Contribution of 10 Ethers by accounts[5]
        .contribute().send({                                                       
            from : accounts[5],
            value : web3.utils.toWei('10', 'ether')
        });

        await campaign.methods                                                                          // 2] Creating Spending Request by accounts[0] i.e by Manager.  (Send 5 Ether to accounts[8].)
          .createRequest(
            "Creating a Spending Request",
            web3.utils.toWei("5", "ether"),
            accounts[8]
          )
          .send({
            from: accounts[0],
            gas: "1000000",
          });

        

        await campaign.methods                                                                           // 3] Approving the spending request of "Manager"
        .approveRequest(0)
        .send({
            from : accounts[5],        // accounts[3] is our only contributer so only he have right to approve request.
            gas : '1000000'
        });

        await campaign.methods                                                                          // 4] Finalizing of Spending request
        .finalizeRequest(0)
        .send({
            from : accounts[0],         // Only manager has the ability of finalizing the request.
            gas : '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[8]);                                           // 5] Verifying weather the vendor i.e accounts[8] have recieved money or not.
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);  // Function takes a string and converts it into a decimal number.

        console.log(balance);
        assert(balance > 104)           // Initial 100 , plus 5 so 105.

    });

})


/* Why this test setup is faster?
1] Before everytime we runs a test, we actually first compile our contract and then run the test.
2] Here everytime time a test is run, we are not compiling it.
3] Our contract is compiled only once and that too when we run our 'compile.js'.
4] Here we directly read the compiled content of our contract.
5] Hence the compilation time is saved.
*/
