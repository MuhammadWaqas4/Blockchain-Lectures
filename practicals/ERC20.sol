// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ExpiringToken
 * - Non-whitelisted addresses: balance expires 15 days after the most recent receipt.
 * - Whitelisted addresses (including the owner): never expire.
 * - Expired balances report 0 via balanceOf() and cannot be transferred.
 * - Anyone can permanently burn an expired balance with burnExpired(account).
 * - Owner manages the whitelist via setWhitelist().
 */
contract USBB is ERC20, Ownable {
    uint256 public expiryPeriod;

    /// Timestamp of the last time an address received tokens.
    mapping(address => uint256) public lastReceived;

    /// Whitelisted addresses are exempt from expiry.
    mapping(address => bool) public isWhitelisted;

    modifier onlyWhitelistedManager() {
        _checkOwner();
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        // Deployer is whitelisted forever.
        isWhitelisted[msg.sender] = true;
        expiryPeriod = 5 minutes;

        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // ---------------------------------------------------------------------
    // Whitelist management (owner only)
    // ---------------------------------------------------------------------

    /// Add or remove an address from the whitelist.
    function setWhitelist(address account, bool status)
        external
        onlyWhitelistedManager
    {
        require(account != address(0), "ExpiringToken: zero address");
        isWhitelisted[account] = status;
    }

    /// Batch-add or remove addresses (gas-friendly for airdrop/vesting setups).
    function setWhitelistBatch(address[] calldata accounts, bool status)
        external
        onlyWhitelistedManager
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            require(accounts[i] != address(0), "ExpiringToken: zero address");
            isWhitelisted[accounts[i]] = status;
        }
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /// Update the expiry window. Applies to every non-whitelisted address,
    /// including timers already in progress (see notes below).
    function setExpiryPeriod(uint256 newPeriod) external onlyOwner {
        expiryPeriod = newPeriod;
    }

    // ---------------------------------------------------------------------
    // Expiry views
    // ---------------------------------------------------------------------

    function isExpired(address account) public view returns (bool) {
        if (isWhitelisted[account]) return false;
        uint256 t = lastReceived[account];
        return t != 0 && block.timestamp > t + expiryPeriod;
    }

    /// Timestamp at which the balance expires. 0 = never.
    function expiresAt(address account) public view returns (uint256) {
        if (isWhitelisted[account]) return 0;
        uint256 t = lastReceived[account];
        return t == 0 ? 0 : t + expiryPeriod;
    }

    /// Expired balances are reported as 0.
    function balanceOf(address account)
        public
        view
        override
        returns (uint256)
    {
        if (isExpired(account)) return 0;
        return super.balanceOf(account);
    }

    // ---------------------------------------------------------------------
    // Burn expired balances
    // ---------------------------------------------------------------------

    /// Permanently burn an expired account's balance. Callable by anyone.
    function burnExpired(address account) external {
        require(isExpired(account), "ExpiringToken: not expired");
        uint256 bal = super.balanceOf(account);
        require(bal > 0, "ExpiringToken: zero balance");

        super._update(account, address(0), bal);
    }

    // ---------------------------------------------------------------------
    // Core transfer hook
    // ---------------------------------------------------------------------

    function _update(address from, address to, uint256 value)
        internal
        override
    {
        // Sender expired: burn their balance first so the transfer reverts.
        if (from != address(0) && isExpired(from)) {
            uint256 bal = super.balanceOf(from);
            if (bal > 0) {
                super._update(from, address(0), bal);
            }
        }

        // Receiver expired: burn their old (expired) balance first so a new
        // deposit doesn't resurrect expired tokens.
        if (to != address(0) && isExpired(to)) {
            uint256 bal = super.balanceOf(to);
            if (bal > 0) {
                super._update(to, address(0), bal);
            }
        }

        super._update(from, to, value);

        // Start / reset the timer only for non-whitelisted receivers.
        if (to != address(0) && !isWhitelisted[to]) {
            lastReceived[to] = block.timestamp;
        }
    }
}