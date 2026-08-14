// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 5 — Modifiers, Access Control & Error Handling

contract OwnerExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function secretMessage() public view onlyOwner returns (string memory) {
        return "Only Owner Can Read This";
    }
}

contract OwnerCounter {
    uint public count;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function increment() public onlyOwner {
        count++;
    }

    function reset() public onlyOwner {
        count = 0;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}

contract ErrorExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function testRequire(uint amount) public pure {
        require(amount > 0, "Amount must be > 0");
    }

    function testRevert() public view {
        if (msg.sender != owner) {
            revert("Not Owner — use revert style");
        }
    }

    function testAssert() public pure {
        uint a = 5;
        uint b = 3;
        uint result = a + b;
        assert(result == 8);
    }
}

contract ProfessionalBank {
    address public owner;
    mapping(address => uint) public balances;
    bool public paused;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function deposit() public payable notPaused {
        require(msg.value > 0, "Send some ETH");
        balances[msg.sender] += msg.value;
    }

    function pause() public onlyOwner {
        paused = true;
    }

    function unpause() public onlyOwner {
        paused = false;
    }

    function getVaultBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }
}
