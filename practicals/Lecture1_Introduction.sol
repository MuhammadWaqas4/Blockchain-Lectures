// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 1 — Blockchain intro + first Solidity file
// SPDX license, pragma version, state variables, constructor, view, keccak256 hashing

contract HelloBlockchain {
    string public greeting = "Hello, Blockchain!";

    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}

contract SimpleStorage {
    uint public storedNumber;
    address public owner;

    constructor() {
        owner = msg.sender;
        storedNumber = 0;
    }

    function setNumber(uint _number) public {
        storedNumber = _number;
    }

    function getNumber() public view returns (uint) {
        return storedNumber;
    }
}

contract HashDemo {
    function hashText(string memory _text) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_text));
    }
}
