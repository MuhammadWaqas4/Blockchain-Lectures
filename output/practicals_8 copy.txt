# Lecture 10 — ERC-20 Token Standard
## Complete Examples + Diagrams

---

## 1. ERC-20 Standard Concept

```text
Wallet
   |
   | understands ERC-20
   |
   v
Token A
Token B
Token C
Token D
```

ERC-20 defines a common interface/behavior for fungible tokens so wallets, exchanges, DeFi protocols, and other applications can interact with different tokens in a consistent way.

---

## 2. Fungible Token Concept

```text
1 USDT = another 1 USDT

1 USD = another 1 USD
```

### ERC-20 vs ERC-721

```text
ERC-20
Fungible

ERC-721
Non-Fungible
```

---

## 3. Core ERC-20 Functions

```text
ERC-20

├── totalSupply()
├── balanceOf()
├── transfer()
├── approve()
├── allowance()
└── transferFrom()
```

### totalSupply()

```text
How many tokens exist?

Example:

1,000,000 MTK
```

### balanceOf(address)

```text
Alice → 500
Bob   → 300
```

### transfer(to, amount)

```text
Owner sends their own tokens
to another wallet.
```

### approve(spender, amount)

```text
Owner gives another address
permission to spend tokens.
```

### allowance(owner, spender)

```text
Checks how many tokens a spender
is allowed to use for an owner.
```

### transferFrom(from, to, amount)

```text
An approved spender transfers
tokens on behalf of the owner.
```

---

# 4. How ERC-20 Balances Are Stored

Bad approach:

```solidity
uint aliceBalance;
uint bobBalance;
uint saraBalance;
```

Correct conceptual approach:

```solidity
mapping(address => uint256) public balances;
```

Diagram:

```text
Wallet Address             Balance

0xAAA...   ------------->   500

0xBBB...   ------------->   300

0xCCC...   ------------->   200
```

Total supply:

```solidity
uint256 public totalSupply;
```

---

# 5. Simple Token — Initial Version

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleToken {

    string public name = "My Token";
    string public symbol = "MTK";

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }
}
```

### Deployment Example

Deploy with:

```text
1000
```

Diagram:

```text
Deploy Token

Initial Supply = 1000

        |
        v

Deployer
balance = 1000
```

After deployment:

```text
totalSupply() → 1000

balanceOf(deployer) → 1000
```

---

# 6. Adding transfer()

```solidity
function transfer(
    address to,
    uint256 amount
)
    public
    returns (bool)
{
    require(
        balanceOf[msg.sender] >= amount,
        "Insufficient balance"
    );

    balanceOf[msg.sender] -= amount;
    balanceOf[to] += amount;

    return true;
}
```

### Transfer Diagram

```text
Before

Alice = 1000
Bob   = 0


Alice calls:

transfer(Bob, 200)


After

Alice = 800
Bob   = 200
```

---

# 7. Transfer Event

ERC-20 defines a Transfer event.

```solidity
event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
);
```

Emit it inside transfer:

```solidity
emit Transfer(
    msg.sender,
    to,
    amount
);
```

Diagram:

```text
transfer()

   ↓

Balances Updated

   ↓

Transfer Event

   ↓

Wallet / Explorer / Frontend / Indexer
```

---

# 8. Approval System

A decentralized application cannot normally take tokens from a user's wallet without authorization.

Example:

```text
Alice
  |
  | owns USDT
  |
  v
DEX Contract
```

Alice first approves the DEX:

```text
Alice

approve(DEX, 100)

       ↓

Allowance

Alice → DEX = 100
```

ERC-20 allowances conceptually use a nested mapping:

```solidity
mapping(address => mapping(address => uint256))
    public allowance;
```

Diagram:

```text
Owner
  |
  +---- Spender
          |
          +---- Allowed Amount
```

Example:

```text
Alice
  |
  └── DEX
       |
       └── 100 tokens
```

---

# 9. Approval Event

```solidity
event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
);
```

---

# 10. approve()

```solidity
function approve(
    address spender,
    uint256 amount
)
    public
    returns (bool)
{
    allowance[msg.sender][spender] = amount;

    emit Approval(
        msg.sender,
        spender,
        amount
    );

    return true;
}
```

Important:

```text
approve() does NOT move tokens.

It only stores permission.
```

---

# 11. transferFrom()

```solidity
function transferFrom(
    address from,
    address to,
    uint256 amount
)
    public
    returns (bool)
{
    require(
        balanceOf[from] >= amount,
        "Insufficient balance"
    );

    require(
        allowance[from][msg.sender] >= amount,
        "Allowance exceeded"
    );

    allowance[from][msg.sender] -= amount;

    balanceOf[from] -= amount;
    balanceOf[to] += amount;

    emit Transfer(
        from,
        to,
        amount
    );

    return true;
}
```

### transferFrom Flow

```text
Alice owns 1000 tokens

Alice approves DEX = 200

        ↓

DEX calls

transferFrom(
    Alice,
    Bob,
    100
)

        ↓

Alice = 900
Bob   = 100

Remaining Allowance = 100
```

---

# 12. Complete Manual ERC-20-Like Token

> This contract is for learning. In production, use a well-reviewed ERC-20 implementation such as OpenZeppelin rather than recreating the standard manually.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleToken {

    string public name = "My Token";
    string public symbol = "MTK";

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256))
        public allowance;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;

        emit Transfer(
            address(0),
            msg.sender,
            _initialSupply
        );
    }

    function transfer(
        address to,
        uint256 amount
    )
        public
        returns (bool)
    {
        require(
            to != address(0),
            "Invalid receiver"
        );

        require(
            balanceOf[msg.sender] >= amount,
            "Insufficient balance"
        );

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(
            msg.sender,
            to,
            amount
        );

        return true;
    }

    function approve(
        address spender,
        uint256 amount
    )
        public
        returns (bool)
    {
        require(
            spender != address(0),
            "Invalid spender"
        );

        allowance[msg.sender][spender] = amount;

        emit Approval(
            msg.sender,
            spender,
            amount
        );

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    )
        public
        returns (bool)
    {
        require(
            from != address(0),
            "Invalid sender"
        );

        require(
            to != address(0),
            "Invalid receiver"
        );

        require(
            balanceOf[from] >= amount,
            "Insufficient balance"
        );

        require(
            allowance[from][msg.sender] >= amount,
            "Allowance exceeded"
        );

        allowance[from][msg.sender] -= amount;

        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(
            from,
            to,
            amount
        );

        return true;
    }
}
```

---

# 13. Manual Token Testing Sequence

### Step 1 — Deploy

```text
Initial Supply: 1000
```

### Step 2 — Check total supply

```text
totalSupply()

→ 1000
```

### Step 3 — Check deployer balance

```text
balanceOf(deployer)

→ 1000
```

### Step 4 — Transfer tokens

```text
transfer(Account2, 200)
```

Expected:

```text
Account1 = 800
Account2 = 200
```

### Step 5 — Approve Account2

From Account1:

```text
approve(Account2, 100)
```

Check:

```text
allowance(Account1, Account2)

→ 100
```

### Step 6 — Switch to Account2

Call:

```text
transferFrom(
    Account1,
    Account3,
    60
)
```

Expected:

```text
Account1 balance = 740
Account3 balance = 60

Allowance:
Account1 → Account2 = 40
```

---

# 14. OpenZeppelin ERC-20

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {

    constructor(uint256 initialSupply)
        ERC20("My Token", "MTK")
    {
        _mint(
            msg.sender,
            initialSupply * 10 ** decimals()
        );
    }
}
```

Architecture:

```text
OpenZeppelin ERC20
        |
        | inheritance
        v
     MyToken
```

Concepts students already know are reused here:

```text
ERC20

  |
  ├── Inheritance
  ├── Functions
  ├── Mappings
  ├── Events
  ├── Interfaces
  └── Internal Logic
```

---

# 15. decimals()

Most ERC-20 tokens commonly use 18 decimal places.

```text
1 whole token

=

1 × 10^18 smallest units
```

Example:

```solidity
initialSupply * 10 ** decimals()
```

If:

```text
initialSupply = 1000
decimals() = 18
```

then the contract mints the smallest-unit representation of:

```text
1000 whole tokens
```

Important:

```text
Solidity still performs integer arithmetic.

"Decimals" are primarily a display convention
used by wallets and applications.
```

---

# 16. ERC-20 Architecture Diagram

```text
                         ERC-20 TOKEN
                              |
        ---------------------------------------------
        |                    |                      |
        v                    v                      v
   Total Supply          Balances              Allowances
        |                    |                      |
 totalSupply()          balanceOf()            approve()
                                                   |
                                                   v
                                              allowance()
                                                   |
                                                   v
                                             transferFrom()

                              |
               --------------------------------
               |                              |
               v                              v
        Transfer Event                  Approval Event
```

---

# 17. Direct Transfer vs Delegated Transfer

```text
DIRECT TRANSFER

Alice
  |
  | transfer(Bob, 100)
  v
Bob
```

Versus:

```text
DELEGATED TRANSFER

Alice
  |
  | approve(DEX, 100)
  v
Allowance

Alice → DEX = 100

        |
        v

DEX calls:

transferFrom(
    Alice,
    Bob,
    100
)

        |
        v

Bob receives 100
```

---

# 18. Typical DeFi Approval Flow

```text
User Wallet
    |
    | 1. approve()
    v
ERC-20 Token Contract
    |
    | allowance stored
    v
DEX / Staking / Lending Contract
    |
    | 2. transferFrom()
    v
Token Movement
```

Example:

```text
Alice has 500 USDT

Alice wants to swap 100 USDT.

Step 1:
approve(DEX, 100)

Step 2:
DEX calls
transferFrom(Alice, DEX, 100)

Step 3:
DEX performs swap logic
```

---

# 19. Mint Event Concept

When new ERC-20 tokens are minted, the Transfer event uses the zero address as the source:

```text
address(0)
    |
    | Transfer
    v
Alice
```

Conceptually:

```solidity
emit Transfer(
    address(0),
    alice,
    amount
);
```

Meaning:

```text
Tokens were created rather than transferred
from an existing token holder.
```

---

# 20. Burning Concept — Optional Preview

Burning is the opposite of minting.

```text
Alice
  |
  | burn
  v
address(0)
```

Conceptually:

```text
Mint:

address(0) → User


Burn:

User → address(0)
```

A later OpenZeppelin extension can provide burn functionality:

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
```

Example:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract BurnableToken is ERC20, ERC20Burnable {

    constructor(uint256 initialSupply)
        ERC20("Burnable Token", "BURN")
    {
        _mint(
            msg.sender,
            initialSupply * 10 ** decimals()
        );
    }
}
```

---

# 21. Complete Lecture 10 Concept Map

```text
                         TOKEN STANDARDS
                                |
                                v
                              ERC-20
                                |
        ---------------------------------------------------
        |                |               |                |
        v                v               v                v
    Fungibility       Supply          Balances        Allowances
                         |               |                |
                         v               v                v
                  totalSupply()     balanceOf()       approve()
                                                          |
                                                          v
                                                     allowance()
                                                          |
                         ---------------------------------
                         |
                         v
                    transferFrom()

             Direct Transfer
                    |
                    v
                transfer()

                     EVENTS
                       |
              ------------------
              |                |
              v                v
          Transfer          Approval

                     PRODUCTION
                         |
                         v
                   OpenZeppelin
                         |
                         v
                       ERC20
```

---

# 22. Important Teaching Points

```text
1. ERC-20 is a standard, not one specific token.

2. ERC-20 represents fungible tokens.

3. balanceOf() tracks balances.

4. transfer() moves the caller's own tokens.

5. approve() only gives permission.
   It does not move tokens.

6. allowance() reports delegated spending permission.

7. transferFrom() uses that permission to move tokens.

8. Transfer and Approval events allow off-chain systems
   to track token activity.

9. ERC-20 commonly uses 18 decimals, but the standard
   itself does not require exactly 18.

10. For production development, prefer well-reviewed
    implementations such as OpenZeppelin instead of
    recreating ERC-20 manually.
```

---

# 23. Suggested Live Demo Order

```text
1. Create SimpleToken
       ↓
2. Deploy with 1000
       ↓
3. Check totalSupply
       ↓
4. Check deployer balance
       ↓
5. Transfer 200
       ↓
6. Inspect balances
       ↓
7. Inspect Transfer event
       ↓
8. approve(Account2, 100)
       ↓
9. Inspect allowance
       ↓
10. Switch to Account2
       ↓
11. transferFrom(Account1, Account3, 60)
       ↓
12. Inspect balances
       ↓
13. Inspect remaining allowance
       ↓
14. Deploy OpenZeppelin MyToken
       ↓
15. Compare manual implementation with OpenZeppelin
```

---

# End of Lecture 10
