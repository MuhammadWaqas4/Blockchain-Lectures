# Test and deploy with Hardhat

Hardhat is a Node.js toolchain for compiling, testing, and deploying Solidity.

The lecture contracts are in [`practicals/`](../../practicals/). This guide uses `Counter` from `Lecture4_Functions_Payable_Bank.sol`.

## 1. Prerequisites

- Node.js LTS ([https://nodejs.org](https://nodejs.org))
- npm (comes with Node.js)

Check:

```bash
node -v
npm -v
```

## 2. Create a Hardhat project

From any empty folder:

```bash
mkdir counter-hardhat
cd counter-hardhat
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

When the wizard asks, choose a **JavaScript** project and say yes to `.gitignore`.

This creates:

- `contracts/`
- `test/`
- `scripts/`
- `hardhat.config.js`

## 3. Add a contract

Replace `contracts/Counter.sol` (or add it) with:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
```

You can also copy any file from [`practicals/`](../../practicals/) into `contracts/`.

## 4. Compile

```bash
npx hardhat compile
```

Artifacts are written to `artifacts/` and `cache/` (already ignored by this repo's `.gitignore`).

## 5. Write and run tests

Create `test/Counter.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  async function deployCounter() {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.waitForDeployment();
    return counter;
  }

  it("starts at zero", async function () {
    const counter = await deployCounter();
    expect(await counter.getCount()).to.equal(0);
  });

  it("increments", async function () {
    const counter = await deployCounter();
    await counter.increment();
    await counter.increment();
    expect(await counter.getCount()).to.equal(2);
  });

  it("decrements", async function () {
    const counter = await deployCounter();
    await counter.increment();
    await counter.decrement();
    expect(await counter.getCount()).to.equal(0);
  });

  it("resets", async function () {
    const counter = await deployCounter();
    await counter.increment();
    await counter.reset();
    expect(await counter.getCount()).to.equal(0);
  });
});
```

Run tests:

```bash
npx hardhat test
```

Hardhat spins up a short-lived local chain for each test file. You do not need to start a node for `npx hardhat test`.

## 6. Deploy locally

Create `scripts/deploy.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  console.log("Counter deployed to:", await counter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Start a local node in one terminal:

```bash
npx hardhat node
```

In a second terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The node prints test accounts and private keys. Use those only on this local chain.

## 7. Deploy to a testnet (Sepolia)

Install dotenv:

```bash
npm install dotenv
```

Create a `.env` file (never commit it):

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
```

Update `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
```

Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

The wallet must have Sepolia ETH from a faucet.

## Safety

- Do not commit `.env`, private keys, or mnemonic files.
- Use a throwaway wallet for testnets. Never use a wallet that holds real funds.
- Keys printed by `npx hardhat node` are for local testing only.

## Next contracts to try

Copy other files from [`practicals/`](../../practicals/) into `contracts/`. If a file has several contracts, Hardhat compiles all of them. In tests and scripts, call `ethers.getContractFactory("ContractName")` with the name you want (`SimpleBank`, `OwnerExample`, and so on).
