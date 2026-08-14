// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 2 — Data Types, Variables & Functions
// uint, bool, string, address, state vs local, view vs pure, constructor, Student Registry

contract DataTypesDemo {
    uint public age = 25;
    bool public isActive = true;
    string public name = "Ali";
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getDefaults() public view returns (uint, bool, string memory, address) {
        return (age, isActive, name, owner);
    }
}

contract Calculator {
    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function subtract(uint a, uint b) public pure returns (uint) {
        return a - b;
    }

    function multiply(uint a, uint b) public pure returns (uint) {
        return a * b;
    }

    function divide(uint a, uint b) public pure returns (uint) {
        require(b > 0, "Cannot divide by zero");
        return a / b;
    }

    function modulus(uint a, uint b) public pure returns (uint) {
        require(b > 0, "Cannot modulo by zero");
        return a % b;
    }
}

contract MyProfile {
    string public name;
    uint public age;
    string public city;

    function setProfile(string memory _name, uint _age, string memory _city) public {
        name = _name;
        age = _age;
        city = _city;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getAge() public view returns (uint) {
        return age;
    }

    function getCity() public view returns (string memory) {
        return city;
    }
}

contract StudentRegistry {
    struct Student {
        string name;
        uint age;
    }

    Student[] public students;

    function addStudent(string memory _name, uint _age) public {
        students.push(Student(_name, _age));
    }

    function getStudentsCount() public view returns (uint) {
        return students.length;
    }
}
