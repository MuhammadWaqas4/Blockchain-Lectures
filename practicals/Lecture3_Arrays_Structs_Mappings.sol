// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 3 — Arrays, Structs, Mappings & Storage vs Memory

contract ArraysDemo {
    uint[] public numbers;

    function addNumber(uint _number) public {
        numbers.push(_number);
    }

    function getLength() public view returns (uint) {
        return numbers.length;
    }

    function removeLast() public {
        numbers.pop();
    }
}

contract StructDemo {
    struct Student {
        string name;
        uint age;
        string department;
    }

    Student public student;

    function setStudent(
        string memory _name,
        uint _age,
        string memory _department
    ) public {
        student = Student(_name, _age, _department);
    }

    function getName() public view returns (string memory) {
        return student.name;
    }
}

contract StudentList {
    struct Student {
        string name;
        uint age;
    }

    Student[] public students;

    function addStudent(string memory _name, uint _age) public {
        students.push(Student(_name, _age));
    }

    function getCount() public view returns (uint) {
        return students.length;
    }

    function getStudent(uint _index) public view returns (string memory, uint) {
        Student memory s = students[_index];
        return (s.name, s.age);
    }
}

contract MappingDemo {
    mapping(address => uint) public balances;

    function setBalance(uint _amount) public {
        balances[msg.sender] = _amount;
    }

    function getBalance(address _addr) public view returns (uint) {
        return balances[_addr];
    }

    function addToBalance(uint _amount) public {
        balances[msg.sender] += _amount;
    }
}

contract UserRegistry {
    struct User {
        string name;
        uint age;
        bool registered;
    }

    mapping(address => User) public users;

    function register(string memory _name, uint _age) public {
        require(!users[msg.sender].registered, "Already registered");
        users[msg.sender] = User(_name, _age, true);
    }

    function isRegistered(address _addr) public view returns (bool) {
        return users[_addr].registered;
    }

    function getName(address _addr) public view returns (string memory) {
        require(users[_addr].registered, "Not registered");
        return users[_addr].name;
    }
}

contract StudentManagement {
    struct Student {
        string name;
        uint age;
        string department;
    }

    Student[] public students;
    mapping(address => bool) public hasRegistered;

    function addStudent(
        string memory _name,
        uint _age,
        string memory _department
    ) public {
        require(!hasRegistered[msg.sender], "You already registered a student");
        students.push(Student(_name, _age, _department));
        hasRegistered[msg.sender] = true;
    }

    function getTotalStudents() public view returns (uint) {
        return students.length;
    }

    function getStudent(uint _index)
        public
        view
        returns (string memory, uint, string memory)
    {
        require(_index < students.length, "Index out of range");
        Student memory s = students[_index];
        return (s.name, s.age, s.department);
    }
}
