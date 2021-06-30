import web3 from './web3';                                   // Here we are import our "web3.js" file and not our installed library.
import CampaignFactory from './build/CampaignFactory.json';  // Importing the file which contains our "Compiled" contract which is "CampaignFactory".


const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x0E164bbA46aba03fd18E2e8F654160f5B719dCf6"
);

export default instance;

/*
Aim : To create an instance of our previously deployed "CampaignFactory" contract..

Process :-
Here we are not deploying any new contract.
We just want to interact with our pre-deployed contract.
We need only two things to do so :-
1] Interface of our deployed contract.
2] Address of our deployed contract.

Source :-
We have our deployed contract stored inside "build" folder.
Also we have address of deployed contract inside "Address" file.
Hence we can get both the things from there
*/

// We have done this same thing inside "lottery-react" Folder, inside : lottery-react > src > lottery.js.
