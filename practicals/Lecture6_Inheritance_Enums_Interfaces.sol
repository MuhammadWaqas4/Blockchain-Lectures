// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 6 — Inheritance, Enums, Abstract Contracts & Interfaces

contract Animal {
    function eat() public pure returns (string memory) {
        return "Animal is eating";
    }

    function sleep() public pure returns (string memory) {
        return "Animal is sleeping";
    }
}

contract Dog is Animal {
    function bark() public pure returns (string memory) {
        return "Woof";
    }
}

contract AnimalWithName {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}

contract DogBreed is AnimalWithName {
    constructor() AnimalWithName("German Shepherd") {}
}

contract DogNamed is AnimalWithName {
    constructor(string memory _dogName) AnimalWithName(_dogName) {}
}

contract CalculatorOverload {
    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function add(uint a, uint b, uint c) public pure returns (uint) {
        return a + b + c;
    }
}

contract DepositExample {
    uint public balance;

    function deposit() public {
        balance += 1;
    }

    function deposit(uint amount) public {
        balance += amount;
    }
}

contract AnimalSound {
    function sound() public pure virtual returns (string memory) {
        return "Animal makes a sound";
    }
}

contract DogSound is AnimalSound {
    function sound() public pure override returns (string memory) {
        return "Woof";
    }
}

contract CatSound is AnimalSound {
    function sound() public pure override returns (string memory) {
        return "Meow";
    }
}

contract Parent {
    function message() public pure virtual returns (string memory) {
        return "Message from Parent";
    }
}

contract Child is Parent {
    function message() public pure override returns (string memory) {
        return "Message from Child";
    }
}

contract Order {
    enum Status {
        Pending,
        Processing,
        Completed,
        Cancelled
    }

    Status public orderStatus;

    function startProcessing() public {
        orderStatus = Status.Processing;
    }

    function completeOrder() public {
        orderStatus = Status.Completed;
    }

    function cancelOrder() public {
        orderStatus = Status.Cancelled;
    }
}

abstract contract AbstractAnimal {
    function sound() public virtual returns (string memory);
}

contract DogFromAbstract is AbstractAnimal {
    function sound() public pure override returns (string memory) {
        return "Bark";
    }
}

interface ICalculator {
    function add(uint, uint) external pure returns (uint);
}

contract Calculator is ICalculator {
    function add(uint a, uint b) public pure override returns (uint) {
        return a + b;
    }
}

contract CalculatorCaller {
    function calculate(address calculator) public view returns (uint) {
        return ICalculator(calculator).add(5, 3);
    }
}
