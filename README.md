# Blockchain Lectures

University course materials for **Blockchain & Solidity**: lecture slides, Remix-ready contract examples, and short guides for Remix, Foundry, and Hardhat.

Developed by Muhammad Waqas.

## What is in this repo

| Path | Contents |
| --- | --- |
| `practicals/` | Six Solidity files, one per lecture |
| `guides/remix/` | How to compile and run those contracts in Remix |
| `guides/foundry/` | How to test and deploy with Foundry |
| `guides/hardhat/` | How to test and deploy with Hardhat |
| `*.json` / `generate_*.js` | Slide data and PPTX generators |
| `slides/` | Generated PowerPoint decks |

## Practicals

Each file has several small contracts. Open the file in Remix and pick one contract from the Deploy dropdown.

| File | Topics |
| --- | --- |
| [practicals/Lecture1_Introduction.sol](practicals/Lecture1_Introduction.sol) | SPDX, pragma, state, constructor, `keccak256` |
| [practicals/Lecture2_DataTypes_Variables_Functions.sol](practicals/Lecture2_DataTypes_Variables_Functions.sol) | Types, `view` / `pure`, Student Registry |
| [practicals/Lecture3_Arrays_Structs_Mappings.sol](practicals/Lecture3_Arrays_Structs_Mappings.sol) | Arrays, structs, mappings |
| [practicals/Lecture4_Functions_Payable_Bank.sol](practicals/Lecture4_Functions_Payable_Bank.sol) | `msg.sender`, payable, Simple Bank |
| [practicals/Lecture5_Modifiers_AccessControl.sol](practicals/Lecture5_Modifiers_AccessControl.sol) | Modifiers, `require` / `revert` / `assert` |
| [practicals/Lecture6_Inheritance_Enums_Interfaces.sol](practicals/Lecture6_Inheritance_Enums_Interfaces.sol) | Inheritance, enums, abstract, interfaces |

Compiler: `pragma solidity ^0.8.20`.

## How to run the contracts

1. **Remix (recommended first)** — browser only, no install.  
   [guides/remix/README.md](guides/remix/README.md)

2. **Foundry** — compile, `forge test`, deploy with Anvil or a testnet.  
   [guides/foundry/README.md](guides/foundry/README.md)

3. **Hardhat** — compile, `npx hardhat test`, deploy locally or to Sepolia.  
   [guides/hardhat/README.md](guides/hardhat/README.md)

## Prerequisites

- Remix: a browser
- Foundry: `foundryup` ([install guide](guides/foundry/README.md))
- Hardhat: Node.js LTS ([install guide](guides/hardhat/README.md))

## Safety

Do not commit `.env` files, private keys, or mnemonics. Use a throwaway wallet on testnets. This repo's `.gitignore` already ignores `.env`, `node_modules/`, Hardhat artifacts, and Foundry broadcast files.
