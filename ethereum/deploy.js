const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json")

const provider = new HDWalletProvider(
  "scare around almost clutch spirit stairs scan trumpet poverty fetch wool exist",
  "https://rinkeby.infura.io/v3/ec2a5eddab6d4046a0f8ef8f7db57754"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Contract is deployed from Account : ${accounts[0]}`);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })                                              // Here no initial arguments are needed.
    .send({ from: accounts[0], gas: 1000000 });

  console.log(`Contract is deployed at : ${result.options.address}`);
};
deploy();

// Note : We are deploying our "CampaignFactory" contract. Now its his job to deploy our "Campaign" contract whenever required.

/* Why this approach is faster?
1] During deployment we are not re-compiling our contract.
2] Instead we are reading the compiled contract details from our "build" folder.
3] Hence our compilation time is saved.
*/