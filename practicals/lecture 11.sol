// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";

contract TrumpNFT is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("TrumpNFT", "Trump FT") {}

    function mint(address to) public {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}