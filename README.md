# Blockchain Lectures

Solidity smart contracts + a Node.js backend workspace.

## Prerequisites

- Node.js (LTS recommended)
- One of:
  - Hardhat (Node-based Solidity workflow)
  - Foundry (Rust-based Solidity workflow)

## Getting started

1. Install dependencies (if you have a `package.json`):

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Run common tasks (examples):

```bash
# backend
npm run dev

# contracts (Hardhat)
npm run test
npm run compile
```

## Environment variables

Put secrets in `.env` (this repo ignores it via `.gitignore`).

Typical variables you might need:

- `RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY`
- `PORT`

## Notes

- Build artifacts and tool caches (Hardhat/Foundry/TypeChain, `dist/`, `node_modules/`, etc.) are ignored by default.
- If you want VS Code settings committed, place them in `.vscode/settings.json` (allowed by `.gitignore`).

