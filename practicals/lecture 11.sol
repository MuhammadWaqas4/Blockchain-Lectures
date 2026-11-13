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



////// practical # 2 ///////



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC721/extensions/ERC721URIStorage.sol";

contract WWW is ERC721, ERC721URIStorage {
    uint256 public nextTokenId;

    constructor() ERC721("WWW", "BTS Army") {}

    function mint(address to, string memory uri) public {
        uint256 tokenId = nextTokenId;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        nextTokenId++;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

/////////////////////////////////////////  practical # 3  /////////////////////////////////////////////////
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    string private baseURI;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function setURI(string memory _uri) public onlyOwner {
        baseURI = _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}