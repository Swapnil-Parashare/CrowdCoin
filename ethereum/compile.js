const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");                                                                      // Requires seprate installation. (This contains some extra functionality than inbuilt 'fs' module.)

const buildPath = path.resolve(__dirname, "build");                                                  // Get path of 'build' folder.      
fs.removeSync(buildPath);                                                                            // Delete entire folder.

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");                           // Getting path of solidity contract.
const source = fs.readFileSync(campaignPath, "utf8");                                                // Reading our contract.

const output = solc.compile(source, 1).contracts;                                                    // Compiling it and taking out our 'contracts' property.
                                                                                                     // Now 'output' contains our both compiled contracts.

fs.ensureDirSync(buildPath);                                                                         // It check weather a directory of given path exist or not, if not it creates one for us.
                                                                                                     // Here we actually recreating our build folder.

for (let contract in output) {
  fs.outputJsonSync(                                                                                  // This function writes a .json file
    path.resolve(buildPath, contract.replace(":", "") + ".json"),                                     // 1st Argument : Path.
    output[contract]                                                                                  // 2nd Argument : Content.
  );
}

/*
Note : 
1] 1st argument of "outputJsonSync()" is path.
2] In windows file name can't have ':' colon in it.
3] "output" is nothing but object which has two keys which are ":Campaign" and ":CampaignFactory".
4] While iterating through "output" using "for-in loop" this keys are hold by variable "contract".
5] In 1st argument which is path, we are trying to create a "json" file. Here we are first removing the ':' from key using .repalce() method.
6] In 2nd argument we are giving the actual content from 'output'.

*/


/* compile.js File :-

Aim : 1]Don't want to run compile.js every time. 
      2]Run it once, store the compiled details and read it whenever required.
      3]Compilation will be done only when we do some active changes in our contract.

Flow : 1] Delete "build" folder.
       2] Read "Campiagn.sol" from "ethereum > contracts".
       3] Compile it. (Remember it contains two contracts 1.CampaignFactory  2.Campaign . So we will get two compiled scripts.)
       4] Write the output in "build" folder.
       5] Each contract will be written in seprate file in 'json' format.
*/
