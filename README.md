# Blockchain Lectures

University course materials for **Blockchain & Solidity**: lecture slide decks, Remix-ready contract examples, and short guides for Remix, Foundry, and Hardhat.

Developed by Muhammad Waqas.

## Folder structure

```text
Blockchain-Lectures/
├── data/              # Slide JSON for lectures 1–9
├── generators/        # PPTX generators (one per lecture)
├── slides/            # Generated PowerPoint decks
├── practicals/        # Remix-ready Solidity examples
├── guides/            # Remix, Foundry, Hardhat how-tos
├── package.json
├── .env.example
└── README.md
```

## Generate slides

```bash
npm install

npm run slides:1        # one lecture
npm run slides:all      # lectures 1–9
```

Output goes to `slides/`.

## Practicals

Each file has several small contracts. Open it in Remix and pick one contract from the Deploy dropdown.

| File | Topics |
| --- | --- |
| [practicals/Lecture1_Introduction.sol](practicals/Lecture1_Introduction.sol) | SPDX, pragma, state, constructor, `keccak256` |
| [practicals/Lecture2_DataTypes_Variables_Functions.sol](practicals/Lecture2_DataTypes_Variables_Functions.sol) | Types, `view` / `pure`, Student Registry |
| [practicals/Lecture3_Arrays_Structs_Mappings.sol](practicals/Lecture3_Arrays_Structs_Mappings.sol) | Arrays, structs, mappings |
| [practicals/Lecture4_Functions_Payable_Bank.sol](practicals/Lecture4_Functions_Payable_Bank.sol) | `msg.sender`, payable, Simple Bank |
| [practicals/Lecture5_Modifiers_AccessControl.sol](practicals/Lecture5_Modifiers_AccessControl.sol) | Modifiers, `require` / `revert` / `assert` |
| [practicals/Lecture6_Inheritance_Enums_Interfaces.sol](practicals/Lecture6_Inheritance_Enums_Interfaces.sol) | Inheritance, enums, abstract, interfaces |
| [practicals/Lecture7_Contract_Architecture.sol](practicals/Lecture7_Contract_Architecture.sol) | Abstract, interfaces, libraries, custom errors, `receive` / `fallback` |
| [practicals/Lecture8_ERC20_Token_Standard.sol](practicals/Lecture8_ERC20_Token_Standard.sol) | ERC-20: balances, `transfer`, `approve`, `transferFrom` |

Compiler: `pragma solidity ^0.8.20`.

## How to run the contracts

1. **Remix** — [guides/remix/README.md](guides/remix/README.md)
2. **Foundry** — [guides/foundry/README.md](guides/foundry/README.md)
3. **Hardhat** — [guides/hardhat/README.md](guides/hardhat/README.md)

## Safety

Do not commit `.env` files, private keys, or mnemonics. Use a throwaway wallet on testnets.
