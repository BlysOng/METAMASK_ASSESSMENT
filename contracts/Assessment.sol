// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    bool public paused;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused();
    event Unpaused();

    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Hey, you are not the owner of this account. Don't be stupid!");
        _;
    }

    // Modifier to check if the contract is not paused
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // Modifier to check if the contract is paused
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        paused = false;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable onlyOwner whenNotPaused {
        // Store previous balance to assert after transaction
        uint256 previousBalance = balance;

        // Perform the deposit
        balance += _amount;

        // Assert the balance is correctly updated
        assert(balance == previousBalance + _amount);

        // Emit the deposit event
        emit Deposit(_amount);
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner whenNotPaused {
        // Store previous balance to assert after transaction
        uint256 previousBalance = balance;

        // Check if the balance is sufficient
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }

        // Perform the withdrawal
        balance -= _withdrawAmount;

        // Assert the balance is correctly updated
        assert(balance == previousBalance - _withdrawAmount);

        // Emit the withdrawal event
        emit Withdraw(_withdrawAmount);
    }

    // This the function where I can transfer the ownership.
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "This is the new owner. Hello!");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // Function just to pause the entire contract
    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Paused();
    }

    // Function just to pause the entire contract
    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpaused();
    }
}
