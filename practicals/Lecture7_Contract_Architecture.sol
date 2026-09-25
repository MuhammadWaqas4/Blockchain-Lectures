// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 7 — Contract Architecture & Advanced Solidity
// Abstract contracts, interfaces, cross-contract calls, libraries,
// custom errors, constant / immutable, receive() & fallback()

// ======================================================
// 1. Abstract contracts — Animal / Dog / Cat
// ======================================================

abstract contract Animal {
    function makeSound() public virtual returns (string memory);

    function sleep() public pure returns (string memory) {
        return "Animal is sleeping";
    }
}

contract Dog is Animal {
    function makeSound() public pure override returns (string memory) {
        return "Woof";
    }
}

contract Cat is Animal {
    function makeSound() public pure override returns (string memory) {
        return "Meow";
    }
}

// ======================================================
// 2. Abstract payment pattern
// ======================================================

abstract contract PaymentProcessor {
    function processPayment(uint amount) public virtual returns (bool);
}

contract CryptoPayment is PaymentProcessor {
    function processPayment(uint amount) public pure override returns (bool) {
        return amount > 0;
    }
}

// ======================================================
// 3. Interface + implementation + cross-contract call
// ======================================================

interface ICalculator {
    function add(uint a, uint b) external pure returns (uint);

    function multiply(uint a, uint b) external pure returns (uint);
}

contract Calculator is ICalculator {
    function add(uint a, uint b) external pure override returns (uint) {
        return a + b;
    }

    function multiply(uint a, uint b) external pure override returns (uint) {
        return a * b;
    }
}

contract CalculatorUser {
    function calculateAdd(
        address calculatorAddress,
        uint a,
        uint b
    ) public view returns (uint) {
        ICalculator calculator = ICalculator(calculatorAddress);
        return calculator.add(a, b);
    }

    function calculateMultiply(
        address calculatorAddress,
        uint a,
        uint b
    ) public view returns (uint) {
        ICalculator calculator = ICalculator(calculatorAddress);
        return calculator.multiply(a, b);
    }
}

// ======================================================
// 4. Read vs modify another contract's state
// ======================================================

contract CounterContract {
    uint public count;

    function increment() public {
        count++;
    }

    function decrement() public {
        count--;
    }
}

interface ICounter {
    function count() external view returns (uint);

    function increment() external;

    function decrement() external;
}

contract CounterCaller {
    ICounter public counter;

    constructor(address _counter) {
        counter = ICounter(_counter);
    }

    function increaseCounter() public {
        counter.increment();
    }

    function decreaseCounter() public {
        counter.decrement();
    }

    function readCounter() public view returns (uint) {
        return counter.count();
    }
}

// ======================================================
// 5. Libraries + using for
// ======================================================

library MathLibrary {
    function square(uint x) internal pure returns (uint) {
        return x * x;
    }
}

contract MathExample {
    using MathLibrary for uint;

    function calculateSquare(uint x) public pure returns (uint) {
        return x.square();
    }
}

library ArrayUtils {
    function max(uint[] memory values) internal pure returns (uint) {
        require(values.length > 0, "Empty array");
        uint maximum = values[0];
        for (uint i = 1; i < values.length; i++) {
            if (values[i] > maximum) {
                maximum = values[i];
            }
        }
        return maximum;
    }
}

contract ArrayExample {
    using ArrayUtils for uint[];

    function getMaximum(uint[] memory values) public pure returns (uint) {
        return values.max();
    }
}

// ======================================================
// 6. Custom errors
// ======================================================

contract Vault {
    address public owner;
    uint public balance;

    error NotOwner();
    error InsufficientBalance(uint requested, uint available);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        balance += msg.value;
    }

    function withdraw(uint amount) public {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        if (amount > balance) {
            revert InsufficientBalance(amount, balance);
        }
        balance -= amount;
        payable(msg.sender).transfer(amount);
    }
}

// ======================================================
// 7. constant & immutable
// ======================================================

contract TokenInfo {
    uint public constant MAX_SUPPLY = 1000000;
    string public constant NAME = "MyToken";
    uint public constant FEE = 5;
}

contract Token {
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }
}

// ======================================================
// 8. receive() & fallback()
// ======================================================

contract EtherReceiver {
    event Received(address sender, uint amount);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
