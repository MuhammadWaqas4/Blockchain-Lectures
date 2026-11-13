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



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @dev Interface a contract must implement to receive NFTs via safeTransferFrom
interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

/// @title SimpleNFT - a minimal, dependency-free ERC721 implementation
contract SimpleNFT1 {
    // ───────────────────────── Events ─────────────────────────
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // ───────────────────────── Storage ─────────────────────────
    string public name;
    string public symbol;
    address public owner;

    uint256 public totalSupply; // 0
    uint256 public immutable maxSupply;
    string private _baseURI;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 = 0, 1, 2, 3 , 2, 1


    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // ───────────────────────── Modifiers ─────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }
    // https://www.trumpcard.gov/

    https://www.trumpcard.gov/1


    //0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

    // ───────────────────────── Constructor ─────────────────────────
    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseURI_,
        uint256 _maxSupply
    ) {
        name = _name;
        symbol = _symbol;
        _baseURI = baseURI_;
        maxSupply = _maxSupply;
        owner = msg.sender;
    }

    // ───────────────────────── ERC165 ─────────────────────────
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x80ac58cd || // ERC721
            interfaceId == 0x5b5e139f;   // ERC721Metadata
    }

    // ───────────────────────── ERC721 views ─────────────────────────
    function balanceOf(address account) public view / pure returns (uint256) {
        require(account != address(0), "Zero address");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address tokenOwner, address operator) public view returns (bool) {
        return _operatorApprovals[tokenOwner][operator];
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return string(abi.encodePacked(_baseURI, _toString(tokenId)));
    }

    // ───────────────────────── Approvals ─────────────────────────
    function approve(address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(to != tokenOwner, "Approve to current owner");
        require(
            msg.sender == tokenOwner || _operatorApprovals[tokenOwner][msg.sender],
            "Not owner nor operator"
        );
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "Approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    // ───────────────────────── Transfers ─────────────────────────
    // From = my w.a
    // to = receiver w.a
    // tokenId = 5
    function transferFrom(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 
    0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
    , 
    5) public {

        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner nor approved");

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        transferFrom(from, to, tokenId);/// to transfer/send the nft,
        require(_checkOnERC721Received(from, to, tokenId, data), "Receiver not ERC721Receiver"); //
    }

    // deletagte call,
    // Low level calls,

    // ───────────────────────── Minting ─────────────────────────
    /// @notice Mint a new token to `to`. Token IDs start at 1.


    function mint(address to, uint256 _id) external onlyOwner returns (uint256 tokenId) {
        0x000000000000000000000000000000 // dead address // 

        require(to != address(0), "Mint to zero address");
        require(totalSupply < maxSupply, "Max supply reached");

        tokenId = ++totalSupply;
        // totalSupply = totalSupply + 1;
        // totalSupply = 2 + 1
        // totalSupply = 3

        tokenID = totalSupply + 1; // 2 + 1; 3

        _owners[tokenId] = to; //  2 -> 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

        _balances[to] += 1; // 2 + 1 =. 3

        emit Transfer(address(0), to, tokenId);
        //  _setTokenURI(tokenId, metadataURI);
        require(_checkOnERC721Received(address(0), to, tokenId, ""), "Receiver not ERC721Receiver");
    }

    /// @notice Burn a token you own or are approved for. // 

    function burn(uint256 tokenId) external {

        // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner nor approved");

        address tokenOwner = ownerOf(tokenId);

        address tokenOwner = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

        delete _tokenApprovals[tokenId];

        _balances[tokenOwner] -= 1;

        delete _owners[tokenId];


        emit Transfer(tokenOwner, address(0), tokenId);
    }

    // ───────────────────────── Admin ─────────────────────────
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    // ───────────────────────── Internals ─────────────────────────

    // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 // mine [1,2,3,5]

    // 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db // Opensea's = 1, 3, (5)

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {

        address tokenOwner = ownerOf(tokenId);

        return (spender == tokenOwner ||
            _tokenApprovals[tokenId] == spender 
            ||
            _operatorApprovals[tokenOwner][spender]
            );
    }

    function _transfer(address from, address to, uint256 tokenId) internal {

        require(ownerOf(tokenId) == from, "From is not owner"); // 5 
        require(to != address(0), "Transfer to zero address");

        delete _tokenApprovals[tokenId];

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.code.length == 0) return true; // EOA, nothing to check

        try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
            return retval == IERC721Receiver.onERC721Received.selector;
        } catch {
            return false;
        }
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SimpleNFTPurchase is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC721 public immutable nft;
    IERC20 public immutable paymentToken;
    address public immutable seller;
    uint256 public immutable price;

    event NFTPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);

    constructor(
        address _nft,
        address _paymentToken,
        address _seller,
        uint256 _price
    ) {
        require(_nft != address(0) && _paymentToken != address(0) && _seller != address(0), "Zero address");
        require(_price > 0, "Price must be > 0");

        nft = IERC721(_nft);
        paymentToken = IERC20(_paymentToken);
        seller = _seller;
        price = _price;
    }

    function buyNFT(uint256 tokenId) external nonReentrant {
        _transferTokenFee(msg.sender, seller, price);
        _transferNFT(seller, msg.sender, tokenId);

        emit NFTPurchased(msg.sender, tokenId, price);
    }

    function _transferTokenFee(address from, address to, uint256 amount) internal {
        paymentToken.safeTransferFrom(from, to, amount);
    }

    function _transferNFT(address from, address to, uint256 tokenId) internal {
        nft.safeTransferFrom(from, to, tokenId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {

    // Trump' wallet = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 = 3 nft [0, 1, 2]
    // Obama = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 =  1  [3]
    // George  = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db = 1 [4] 

    uint256 public nextTokenId; // default = 0
    uint256 public totalSupply;

    constructor()
        ERC721("My NFT Collection", "MNFT")
    {}

// Public Housing department , 
    function mint(address to, uint256 housenumber) public {

        // uint256 tokenId = nextTokenId;

        // nextTokenId++; // nextTokenId = 0 + 1; = 1;   nextTokenId = 1 + 1 = 2
        totalSupply++;

        _safeMint(to, housenumber); // 0 - 98, 

// _mint(to, housenumber); // to contract,



         // (0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 1) // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 transfers to someone else


          // (0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 12) // X

         // (0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 2)
         // (0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 3)
        // (0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, 4)




         // 3 doesnt exist, ERC721NonexistentToken

        //  _setTokenURI(tokenId, metadataURI);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// transfers
// transfer from
// balance of

// Trump' wallet = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Obama = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// George  = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TRUMPTOKEN is ERC20 {

    constructor()
        ERC20("TRUMP TOKEN", "TT")
    {
        _mint(
            msg.sender,
            100 * 10 ** decimals()
        );
    }
}

// ERC20 , 

// 1 token = 1 token


// 1 usd -> trump 
// obama 1 usd 
// fungible tokens, erc20.