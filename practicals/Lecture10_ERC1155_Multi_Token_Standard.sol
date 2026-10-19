// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Lecture 10 — ERC-1155 Multi-Token Standard
// One contract, many token IDs (fungible + unique + semi-fungible),
// balanceOf(account, id), safeTransferFrom with amount, batch ops
//
// Remix: set Solidity compiler to 0.8.24 or newer (OpenZeppelin 5.x requires it).
// Remix: enable OpenZeppelin via GitHub import or the Remix OZ plugin.

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// ======================================================
// 1. GameItems — simplest ERC-1155 starter
// Why ERC-1155? Games need many item types (gold, sword, potion…)
// without deploying a separate contract per item.
//
// After deploy, check (as the deployer address):
//   balanceOf(you, 0) → 10000  (GOLD)
//   balanceOf(you, 1) → 1      (SWORD)
//   balanceOf(you, 2) → 500    (POTION)
// ======================================================

contract GameItems is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SWORD = 1;
    uint256 public constant POTION = 2;

    // uri_ can include "{id}" — wallets replace it with the 64-char hex token id
    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10000, "");
        _mint(msg.sender, SWORD, 1, "");
        _mint(msg.sender, POTION, 500, "");
    }
}

// ======================================================
// 2. BlockchainGame — full practical (intentionally insecure mint)
// WARNING: mintItem is PUBLIC on purpose — anyone can mint unlimited GOLD
// and wreck the game economy. Fix it in BlockchainGameSecure below.
//
// Try:
//   mintItem(GOLD, 1000)
//   mintStarterPack(classmate)
//   safeTransferFrom(you, Bob, GOLD, 100, "0x")
//   safeBatchTransferFrom(you, Bob, [0,1,2], [100,1,5], "0x")
// ======================================================

contract BlockchainGame is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SWORD = 1;
    uint256 public constant SHIELD = 2;
    uint256 public constant POTION = 3;
    uint256 public constant ARROW = 4;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {}

    /// @dev DEMO ONLY — public mint lets anyone mint unlimited items.
    function mintItem(uint256 id, uint256 amount) public {
        _mint(msg.sender, id, amount, "");
    }

    function mintStarterPack(address to) public {
        uint256[] memory ids = new uint256[](3);
        uint256[] memory amounts = new uint256[](3);

        ids[0] = GOLD;
        ids[1] = SWORD;
        ids[2] = POTION;

        amounts[0] = 100;
        amounts[1] = 1;
        amounts[2] = 5;

        _mintBatch(to, ids, amounts, "");
    }
}

// ======================================================
// 3. BlockchainGameSecure — Lecture 5 access control + ERC-1155
// Pattern: owner + onlyOwner (from Lecture 5)
// Also: each player may claim only one starter pack.
//
// Deploy → only the deployer can mintItem / mintStarterPack.
// Players: claimStarterPack() once → hasStarterPack[you] = true
// ======================================================

contract BlockchainGameSecure is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SWORD = 1;
    uint256 public constant SHIELD = 2;
    uint256 public constant POTION = 3;
    uint256 public constant ARROW = 4;

    address public owner;
    mapping(address => bool) public hasStarterPack;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        owner = msg.sender;
    }

    function mintItem(uint256 id, uint256 amount) public onlyOwner {
        _mint(msg.sender, id, amount, "");
    }

    function mintStarterPack(address to) public onlyOwner {
        _giveStarterPack(to);
    }

    /// @notice Player-facing claim — one pack per address
    function claimStarterPack() public {
        require(!hasStarterPack[msg.sender], "already claimed");
        _giveStarterPack(msg.sender);
    }

    function _giveStarterPack(address to) internal {
        require(!hasStarterPack[to], "already claimed");
        hasStarterPack[to] = true;

        uint256[] memory ids = new uint256[](3);
        uint256[] memory amounts = new uint256[](3);

        ids[0] = GOLD;
        ids[1] = SWORD;
        ids[2] = POTION;

        amounts[0] = 100;
        amounts[1] = 1;
        amounts[2] = 5;

        _mintBatch(to, ids, amounts, "");
    }
}

/*
  Remix checklist (Lecture 10)

  1) Compiler → 0.8.24+
  2) Deploy GameItems → balanceOf(you, 0/1/2) → 10000 / 1 / 500
  3) Deploy BlockchainGame → mintItem(0, 1000) as ANY account (shows the bug)
  4) BlockchainGame → mintStarterPack(Bob)
     → balanceOf(Bob, 0)=100, balanceOf(Bob, 1)=1, balanceOf(Bob, 2)=5
  5) safeTransferFrom(you, Bob, GOLD, 100, 0x)
  6) safeBatchTransferFrom(you, Bob, [0,1,2], [100,1,5], 0x)
  7) Deploy BlockchainGameSecure → non-owner mintItem should revert "Not Owner"
  8) claimStarterPack() twice → second call reverts "already claimed"

  Choosing a standard
    Every unit equivalent     → ERC-20
    Every token unique        → ERC-721
    Many types + quantities   → ERC-1155

  Key comparison
    ERC-721:  balanceOf(account)           // how many NFTs
    ERC-1155: balanceOf(account, id)       // how many of that id
    ERC-721:  safeTransferFrom(from, to, id)
    ERC-1155: safeTransferFrom(from, to, id, amount, data)
*/
