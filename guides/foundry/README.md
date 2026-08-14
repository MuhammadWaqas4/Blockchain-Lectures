# Test and deploy with Foundry

Foundry is a Solidity toolkit written in Rust. The three commands you will use most are:

- `forge` — compile, test, and deploy
- `anvil` — local Ethereum node
- `cast` — send calls and read chain data from the terminal

The lecture contracts are in [`practicals/`](../../practicals/). This guide uses `Counter` from `Lecture4_Functions_Payable_Bank.sol`.

## 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Check the install:

```bash
forge --version
anvil --version
```

## 2. Create a Foundry project

From any empty folder (do not run this inside this lectures repo unless you want a nested project):

```bash
forge init counter-foundry
cd counter-foundry
```

`forge init` creates `src/`, `test/`, `script/`, and `foundry.toml`.

Copy one contract into `src/`. For a first test, copy only `Counter` into `src/Counter.sol`:

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

Delete the sample `src/Counter.sol` that `forge init` created if it is already there, then paste the version above.

## 3. Compile

```bash
forge build
```

A successful compile prints artifact paths under `out/`.

## 4. Write and run tests

Replace `test/Counter.t.sol` with:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        counter = new Counter();
    }

    function test_InitialCountIsZero() public view {
        assertEq(counter.getCount(), 0);
    }

    function test_Increment() public {
        counter.increment();
        counter.increment();
        assertEq(counter.getCount(), 2);
    }

    function test_Decrement() public {
        counter.increment();
        counter.decrement();
        assertEq(counter.getCount(), 0);
    }

    function test_Reset() public {
        counter.increment();
        counter.reset();
        assertEq(counter.getCount(), 0);
    }
}
```

Run tests:

```bash
forge test
forge test -vvv
```

`-vvv` prints traces when a test fails.

## 5. Deploy locally with Anvil

Start a local chain in one terminal:

```bash
anvil
```

Anvil prints 10 test accounts and their private keys. Use the first key only on this local node.

In a second terminal, from the project folder:

```bash
forge create src/Counter.sol:Counter \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <ANVIL_PRIVATE_KEY>
```

`forge create` prints the deployed address. Read the count:

```bash
cast call <DEPLOYED_ADDRESS> "getCount()(uint256)" --rpc-url http://127.0.0.1:8545
```

Increment it:

```bash
cast send <DEPLOYED_ADDRESS> "increment()" \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <ANVIL_PRIVATE_KEY>
```

## 6. Deploy with a script (optional)

`script/Counter.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    function run() external {
        vm.startBroadcast();
        new Counter();
        vm.stopBroadcast();
    }
}
```

Run it against Anvil:

```bash
forge script script/Counter.s.sol:CounterScript \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <ANVIL_PRIVATE_KEY> \
  --broadcast
```

## 7. Deploy to a testnet (Sepolia)

Create a `.env` file in the Foundry project (never commit it):

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
```

Load it and deploy:

```bash
source .env

forge create src/Counter.sol:Counter \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

The wallet must have Sepolia ETH from a faucet.

## Safety

- Do not commit `.env`, private keys, or mnemonic files.
- Use a throwaway wallet for testnets. Never paste a mainnet key into the terminal or a repo.
- Anvil keys are public test keys. They are not secret, and they hold no real ETH.

## Next contracts to try

Copy other files from [`practicals/`](../../practicals/) into `src/`. If a file has several contracts, you can keep them together and deploy a specific name with `src/File.sol:ContractName`.
