// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Lecture 8 — ERC-20 Token Standard
// Fungible tokens, balances, transfer, approve, allowance, transferFrom

// ======================================================
// 1. Practical 1 — SimpleToken starter (mint only)
// Deploy with constructor arg: 1000
// ======================================================

contract SimpleTokenStarter {
    string public name = "My Token";
    string public symbol = "MTK";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }
}

// ======================================================
// 2. IERC20 — the standard function surface
// ======================================================

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// ======================================================
// 3. Complete SimpleToken — manual ERC-20-like token
// Deploy with constructor arg: 1000
// ======================================================

contract SimpleToken {
    string public name = "My Token";
    string public symbol = "MTK";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

// ======================================================
// 4. TokenSpender — uses approve + transferFrom
// Deploy SimpleToken first, then this contract.
// Alice: approve(spender, 100) then TokenSpender.pullTokens(...)
// ======================================================

contract TokenSpender {
    function pullTokens(
        address tokenAddress,
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        return IERC20(tokenAddress).transferFrom(from, to, amount);
    }

    function checkAllowance(
        address tokenAddress,
        address owner,
        address spender
    ) public view returns (uint256) {
        return IERC20(tokenAddress).allowance(owner, spender);
    }
}

/*
  OpenZeppelin production pattern (needs npm / Remix GitHub import):

  import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

  contract MyToken is ERC20 {
      constructor(uint256 initialSupply) ERC20("My Token", "MTK") {
          _mint(msg.sender, initialSupply * 10 ** decimals());
      }
  }

  decimals() defaults to 18, so 1000 whole tokens = 1000 * 10^18 units.
*/
