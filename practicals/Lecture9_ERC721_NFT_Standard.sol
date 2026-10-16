// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Lecture 9 — ERC-721 NFT Standard
// Fungible vs non-fungible, token IDs, ownership, minting, transfers, metadata
//
// Remix: set Solidity compiler to 0.8.24 or newer (OpenZeppelin 5.x requires it).
// Remix: enable OpenZeppelin via GitHub import or the Remix OZ plugin.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// ======================================================
// 1. NFTOwnershipConcept — learning model only
// NOT ERC-721 compliant. Shows the idea: tokenId → owner.
// Deploy, then: mint(yourAddress) a few times, check owners / balances,
// then transfer(to, tokenId).
// ======================================================

contract NFTOwnershipConcept {
    mapping(uint256 => address) public owners;
    mapping(address => uint256) public balances;
    uint256 public nextTokenId;

    // Concept only:
    //   owners[1] = Alice
    //   owners[2] = Bob
    //   balances[Alice] = 1

    function mint(address to) public returns (uint256 tokenId) {
        require(to != address(0), "mint to zero address");
        tokenId = nextTokenId;
        nextTokenId++;
        owners[tokenId] = to;
        balances[to] += 1;
    }

    function transfer(address to, uint256 tokenId) public {
        require(owners[tokenId] == msg.sender, "not owner");
        require(to != address(0), "transfer to zero address");

        owners[tokenId] = to;
        balances[msg.sender] -= 1;
        balances[to] += 1;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = owners[tokenId];
        require(owner != address(0), "token does not exist");
        return owner;
    }
}

// ======================================================
// 2. MyNFT — first real ERC-721 (OpenZeppelin)
// Deploy, then mint(yourAddress).
// Check: ownerOf(0), balanceOf(yourAddress), name(), symbol()
// Transfer: safeTransferFrom(you, classmate, 0)
// ======================================================

contract MyNFT is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("My NFT Collection", "MNFT") {}

    function mint(address to) public {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        // _safeMint checks that a receiving contract can accept NFTs
        _safeMint(to, tokenId);
    }
}

// ======================================================
// 3. CourseNFT — per-token metadata with ERC721URIStorage
// Deploy, then:
//   mint(yourAddress, "ipfs://QmExample/1.json")
//   tokenURI(0) → ipfs://QmExample/1.json
//
// Example metadata JSON (NOT Solidity — stored off-chain):
//{
//  "name": "Blockchain Warrior #1",
//  "description": "A warrior from our NFT collection",
//  "image": "ipfs://.../warrior1.png",
//  "attributes": [
//    { "trait_type": "Strength", "value": 90 },
//    { "trait_type": "Level", "value": 5 }
//  ]
//}
// ======================================================

contract CourseNFT is ERC721URIStorage {
    uint256 public nextTokenId;

    constructor() ERC721("Course NFT", "CNFT") {}

    function mint(address to, string memory metadataURI) public {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }
}

/*
  Remix checklist (Lecture 9)

  1) Compiler → 0.8.24+
  2) Deploy NFTOwnershipConcept → mint → owners(0) / balances
  3) Deploy MyNFT → mint(you) → ownerOf(0) / balanceOf(you)
  4) MyNFT → safeTransferFrom(you, Bob, 0) → ownerOf(0) = Bob
  5) MyNFT → approve(Marketplace, 0)  OR  setApprovalForAll(Marketplace, true)
  6) Deploy CourseNFT → mint(you, "ipfs://QmExample/1.json") → tokenURI(0)

  Key comparison
    ERC-20:  transfer(Bob, 100)           // moves an amount
    ERC-721: safeTransferFrom(Alice, Bob, 7)  // moves one specific NFT
*/
