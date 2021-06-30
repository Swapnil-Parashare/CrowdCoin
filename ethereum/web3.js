import Web3 from "web3";


let web3;

if(typeof window !== "undefined" && typeof window.ethereum !== "undefined")               // Condition 1 : We are in the User's Browser and Metamask is running.
{
      window.ethereum.request({ method: "eth_requestAccounts" });                         // Requesting access from "Metamask" to connect with our application.
      web3 = new Web3(window.ethereum);                                                   // Replacing the default web3 instance of metamask with our own web3 instance.
}
else
{
      const provider = new Web3.providers.HttpProvider(                                    //  Condition 2 : We are on our server OR User is not running metamask.
        "https://rinkeby.infura.io/v3/ec2a5eddab6d4046a0f8ef8f7db57754"
      );
      web3 = new Web3(provider);
}

export default web3;

/*
 Why replacement is needed?
1] It doesn't matter on which website you are, metamask will always inject an instance of web3 in it. We cannot stop it from doing so.
2] Metamask uses old version of web3 which relies on callbacks.
3] But the good thing is it has an inbuilt provider which connect metamask to any selected network.
4] Metamask's provider also has access to Pub/Pri keys of all our accounts.
5] We are using latest version of web3, so we are required to replaced metamask's provider with our own provider. 
6] We actually repaced the whole "Old Web3" instance of metamask with our "Latest Web3" instance
7] In this way we can use any version of web3 which we want while working with metamask.

IMP : We are connencting our "Metamask Account" with our "Application" inorder to achieve above thing.
      Metamask ask for your password and then connection is formed between metamask and application.

Note :  We have done this same thing inside "lottery-react" Folder, inside : lottery-react > src > web3.js
*/

/*
Next.js : Server Side Rendering : Advantage :-

1]During server side redering we will write all the logic for fectching
  data from Ethereum Network which our user will view.
2]Later on when we send our code, it will only work if user has Metamask installed.
3]If metamask is not avaialable code will not work, but it will not affect our application.
4]As all the data fetching is done at our server itself.

Note : 
1] This web3.js file is executed two times. 
2] 1st time on the next.js server to initially render our application.
3] 2nd time on the browser.
4] When execution happens on the server, "window" is undefined, hence we see an error.
*/

