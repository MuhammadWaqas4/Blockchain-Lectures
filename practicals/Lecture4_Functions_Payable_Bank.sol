// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 4 — Functions, view vs pure, msg.sender, payable, require, Simple Bank

contract Counter {
    uint public count;

    function increment() public {
        count++;
    }

    function decrement() public {
        count--;
    }

    function reset() public {
        count = 0;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}

contract UserIdentity {
    address public owner;
    address public lastCaller;

    constructor() {
        owner = msg.sender;
    }

    function saveUser() public {
        lastCaller = msg.sender;
    }

    function whoAmI() public view returns (address) {
        return msg.sender;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}

contract Wallet {
    function deposit() public payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}

    fallback() external payable {}
}

contract ValueDemo {
    mapping(address => uint) public deposits;

    function deposit() public payable returns (uint) {
        deposits[msg.sender] += msg.value;
        return msg.value;
    }

    function depositMinimum() public payable {
        require(msg.value >= 0.01 ether, "Minimum deposit is 0.01 ETH");
        deposits[msg.sender] += msg.value;
    }

    function myDeposit() public view returns (uint) {
        return deposits[msg.sender];
    }
}

contract SimpleBank {
    address public owner;
    mapping(address => uint) public balances;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Send some ETH");
        balances[msg.sender] += msg.value;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function myBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    function ownerPanel() public view returns (string memory) {
        require(msg.sender == owner, "Not Owner");
        return "Welcome, Bank Owner!";
    }
}
