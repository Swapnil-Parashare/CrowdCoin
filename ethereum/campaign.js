import web3 from './web3';                                    // Here we are importing our web3.js file.
import Campaign from './build/Campaign.json'                  // We need this to get "interface" of our contract.

const instance = (address) => {
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    )
}

export default instance;                                      // This is the instance of the 'campaign' which is deployed by the user, hence address will be taken from url at the time of invokation.
                                                              // This instance is used in 'show.js'.

/* Aim :-
1] To create a function which takes single argument i.e "address" of deployed 'campaigm'.
2] Function will return an "instance" of it, through which we can interact with our deployed campaign.
3] Note : Deployment of 'campaigns' is done by "CampaignFactory" contract.
*/

/* Process :-
1] When we compile our smart contract we get i)Bytecode ii)Interface
2] When we deploy our smart contract we reqire "Bytecode" and "Interface", we can get back "Address" of our deployed contract.
3] When we want to interact with our deployed contract we need i)Address ii)Interface.

*/