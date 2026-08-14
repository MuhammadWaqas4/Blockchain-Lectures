# Run Solidity contracts in Remix IDE

Remix is a browser-based Solidity IDE. You do not need to install anything.

The lecture examples live in [`practicals/`](../../practicals/). Start with `Lecture1_Introduction.sol`.

## 1. Open Remix

Go to [https://remix.ethereum.org](https://remix.ethereum.org).

If Remix asks to load a default workspace, accept it.

## 2. Create a file and paste a contract

1. In the **File Explorer** (left sidebar), open the `contracts` folder.
2. Click the new-file icon and name it `Lecture1_Introduction.sol`.
3. Open [`practicals/Lecture1_Introduction.sol`](../../practicals/Lecture1_Introduction.sol) in this repo, copy the full file, and paste it into Remix.

You can repeat this for any lecture file (`Lecture2_...` through `Lecture6_...`).

## 3. Compile

1. Open the **Solidity Compiler** tab (the compiler icon).
2. Set **Compiler** to `0.8.20` (or any `0.8.x` that matches `pragma solidity ^0.8.20`).
3. Click **Compile Lecture1_Introduction.sol**.
4. A green checkmark means it compiled. A red error means a syntax or version problem — read the message in the terminal at the bottom.

## 4. Deploy on Remix VM

1. Open the **Deploy & Run Transactions** tab (the Ethereum logo).
2. Set **Environment** to `Remix VM (Shanghai)` or `Remix VM (Cancun)`. This is a fake chain in the browser — no real ETH, no MetaMask needed.
3. Open the **Contract** dropdown. These lecture files contain several contracts in one file. Pick one, for example `HelloBlockchain`.
4. Click **Deploy**.
5. The deployed contract appears under **Deployed Contracts**. Expand it.

## 5. Call functions

- Blue buttons are `view` / `pure` — they only read data. Click them to see the return value.
- Orange buttons change state. Click them, then wait for the transaction to confirm in the Remix terminal.
- For `HelloBlockchain`, click `getGreeting` or `greeting`. You should see `Hello, Blockchain!`.
- For `SimpleStorage`, type a number into `setNumber`, click it, then click `getNumber`.

## Notes

- **Several contracts in one file.** Remix lists every contract in the dropdown. Deploy the one you want to try. You can deploy more than one.
- **Payable functions.** Lectures 4 and 5 have `deposit()` functions that receive ETH. Before clicking `deposit`, set **Value** (top of Deploy & Run) to something like `1` ether, then click the button.
- **`msg.sender` and owner.** Remix VM gives you several test accounts in the **Account** dropdown. Deploy with Account 1, then switch to Account 2 and call an `onlyOwner` function — it should revert. That is how access control is tested.
- **Sepolia (optional).** To deploy on a public testnet, set Environment to **Injected Provider - MetaMask**, switch MetaMask to Sepolia, get free test ETH from a faucet, then deploy. Do not use a wallet that holds real funds.

## Suggested order

1. `Lecture1_Introduction.sol` — `HelloBlockchain`, `SimpleStorage`, `HashDemo`
2. `Lecture2_DataTypes_Variables_Functions.sol` — `Calculator`, `MyProfile`
3. `Lecture4_Functions_Payable_Bank.sol` — `Counter`, then `SimpleBank` with Value
4. `Lecture5_Modifiers_AccessControl.sol` — `OwnerExample` with two accounts
5. `Lecture6_Inheritance_Enums_Interfaces.sol` — `Dog`, `Order`
