// SPDX-License-Identifier: MIT
pragma solidity >=0.4.26;                             


contract CampaignFactory{                                                       // This contract is now responsible for actually deployed our "Campaign" contract.
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {                              // This function of "CampaignFactory" is deploying contract "Campaign".
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
    
}

contract Campaign{
    
   struct Request {                                                                                              // Our "Idea Person" need to create a "Spending Request" and get it approved by the contributers in order to spend the money.This is the structure of that 'Request'.
        string description;                                                                                      // Why are you spending money?
        uint value;                                                                                              // How many money are you spending?
        address recipient;                                                                                       // To who are you going to send this money?
        bool complete;                                                                                           // This is the status of our request. Weather it is processed or pending.
        uint approvalCount;                                                                                       // Count of approvers who have voted "YES" for this request.
        mapping(address => bool) approvals;                                                                      // Due to this mapping we can remain assured that one approver can vote only once. We can check weather he has previously voted or not.
   }
    
    Request[] public requests;                                                                                  // Array of 'Requests'
    address public manager;                                                                                     // This is the address of "Idea Person".
    uint public minimumContribution;                                                                            // This is the minimum contribution which our "contributers" are required to do.
    mapping(address => bool) public approvers;                                                                         // This is the list of all our "Contributers". As they are the person who will approve the spending request of 'manager', hence they are called as "approvers".
    uint public approversCount;                                                                                        // We store "approvers" using mapping. We can't iterate neither through keys or value. We can't fetch the things, also can't count them.
                                                                                                                // We need to know total approvers, to see weather to approve a request, on basis of votes recieved.(50% Criteria). We will increament this counter whenever someone contributes.
    
    modifier restricted(){                                                                                      // Some Functions are restricted to "manager" i.e Idea Person like "Creating Spending Request", "Sending Money to Vendors" etc.
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public{                                                                           // This is our contructor. One who deploys the contract is set as manager. 
        manager = creator;                                                                                   // An interger is given as argument which will be "Minimum Contribution" required to be done.
        minimumContribution = minimum;                                                                      
    }
    
    function contribute() public payable{                                                                       // This is a payable function. Anyone can call it and can do contribution. 
        require(msg.value > minimumContribution);                                                               // Contribution should be greater than minimum contribution.
        approvers[msg.sender] = true;                                                                           // His address is added into approvers record(Mapping). We are putting 'address' as key and 'true' as value.
        approversCount++;                                                                                       // To keep track of total number of contributers.
        
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {               // Only 'manager' i.e Idea Person can call this function. Through this function a "Spending Request" can be created.
       
         Request memory newRequest = Request({                                                                   // Why 'memory'? Revise "storage_memory.sol"                                        
            description : description,
            value : value, 
            recipient : recipient,
            complete : false,
            approvalCount : 0                                                                                    // Here we are not initializing "approvals" because it is "Reference Type". While initializing a structure we need to initialize all the properties which are "Value Type"
        });
        
        requests.push(newRequest);
        
    }
    
    function approveRequest(uint index) public {         // Our contributers can call this function on a particular request inorder to approve it.
        Request storage request = requests[index];       // We already have an array of requests. So lets fetch our desired request from it. Due to "storage" it will refer to actual memory location. Thus changes will be reflected in orignal copy.
        require(approvers[msg.sender]);                  // 1st Check :- Person is our contributer.                             Logic :- He should be present in our 'approvers' mapping.
        require(!request.approvals[msg.sender]);         // 2nd Check :- He should not have voted on the request previously.    Logic :-  i) We will pull out desired request(structure) from our array.
                                                         //                                                                              ii) It has "mapping" 'approvals' as a property. Here Key : Addresses of contributers who has approved the request.  Value : True
                                                         //                                                                             iii) If we give an addresses and it is returning true, it means he has previously voted.
                                                         //                                                                              iv) If we give an addresses which is not present as a key, then here in 'solidity' default value is returned in mapping which is "False" for bool datatype.
                                                         //                                                                               v) Thus if false is returned, then we can remain assured and can procced.
        request.approvals[msg.sender] = true;            // Including the person into our 'approvals' mapping.
        request.approvalCount++;                         // Increment the 'Vote Count' of our request.
        
        /* Note : 1]Inside our 'request' structure, "approvers" and "approvals" both are kept as "Mapping" and not "Array".
                  2]This is because for each vote we need to do check for i)"approvers" ---> To ensure he is a contributer.
                                                                         ii)"approvals" ---> To ensure he is not voted previously.
                  3]For doing this look-up, "Mapping" takes constant time and "Array" takes "Linear" time.
                  4]Everytime our contributer vote this process is to be followed. 
                  5]Now we can have thousands of contributers which can vote for "n" numbers of request, this will ultimately cost tremendious amount of gas to get processed.
                  6]To save this, we are using mapping.
        */
    }
    
    function finalizeRequest(uint index) public restricted {            // Only "Manager" can call this function. It can be called only on the requests which are approved. This function is for actually sending money to the vendors through the requests which are "Approved"
        
        Request storage request = requests[index];                      // Fetching up the desired request from our array using 'storage'.
        
        require(!request.complete);                                     // 1]Status of the request should not be complete.
                                                                        // 2]We will set it as true after finalizing it. 
                                                                        // 3]Thus we can be assured that same "Approved" request is not "Finalized " multiple times. If manager tries to do so, this condition will not be passed.
        
        require(request.approvalCount > (approversCount/2));             // Here we are checking the 50% criteria.
        
        
        request.recipient.transfer(request.value);                       // After checking above two condition we are transfering 'money' to 'vendor'. Both were specified in request itself. "Value" is in "Wie" and not "Ether".
        
        request.complete = true;                                         // Modifying the status as complete.
        
        
    }

    function getSummary() public view returns (uint,uint,uint,uint,address ){  // This is to get details of our deployed contract. Off course we can make seprate calls of the function which are created by compiler itself.
        return(                                                                // Doing 5 seprate function calls will make our application slow. Hence this function helps us in this scenario.
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}

/*
Approach :-
1] One contract can deploy another contract. The one who sends the transaction has to pay for "Deployment" process.
2] Whenever our user clicks on "Create Campaign" button, we will make user's "Metamask" to send trasaction to our contract "Campaign Factory".
3] The contract "Campaign Factory" will then deploy our contract "Campaign".
4] A small change is done in "Campaign", manager is not now a sender any more, as contract is deployed by "CampaignFactory", we don't want this contract as the manager.
5] So we will take "manager address" as argument to constructor of "Campaign". It will be passed by "Campaign Factory", which will be equal to user's address.
4] Thus we will not be sharing our contract source code, so user have no chance to manipulate it.
5] At the same time we are making our user to deploy the contract, so he will pay for it and also he will be the "manager" of the contract.
6] Contract "Campaign Factory" also holds the list of all the deployed contract, so we can display it on our site.


Advantages of this Approach :-
1] Increases level of Security.
2] Now we can keep track of all our deployed contracts.

*/


