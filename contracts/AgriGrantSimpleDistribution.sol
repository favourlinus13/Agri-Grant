// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriGrantSimpleDistribution {
    // State Variables
    address public admin;
    bool public paused = false;
    uint public totalDeposited;
    uint public totalDistributed;
    address[] public registeredFarmers;
    

    struct Farmer {
        bool isRegistered;
        uint grantsReceived;
    }

    mapping(address => Farmer) public farmers;
    mapping(address => uint256) public farmerBalances;

    // Events for transparency
    event FarmerRegistered(address indexed farmer);
    event FundsDeposited(address indexed admin, uint amount);
    event GrantDistributed(address indexed farmer, uint amount);
    event ContractPaused(bool isPaused);
    event GrantWithdrawn(address indexed farmer, uint256 amount);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    modifier contractActive() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier farmerExists(address _farmer) {
        require(farmers[_farmer].isRegistered, "Farmer not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Admin can register farmers
    function registerFarmer(address _farmer) external onlyAdmin contractActive {
        require(!farmers[_farmer].isRegistered, "Farmer already registered");
        farmers[_farmer] = Farmer(true, 0);
        require(_farmer != address(0), "Invalid farmer address");
        registeredFarmers.push(_farmer);
        emit FarmerRegistered(_farmer);
    }

    function getAllFarmers() public view returns (address[] memory) {
        return registeredFarmers;
    }

    // Get the farmers Balance
    function getFarmerBalance(address farmer) public view returns (uint256) {
        return farmerBalances[farmer];
    }

    // Admin can deposit ETH into the contract
    function depositFunds() external payable onlyAdmin contractActive {
        require(msg.value > 0, "Must send some ETH");
        totalDeposited += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    // Sending Grants
    function sendGrant(address farmer) public payable onlyAdmin {
        require(farmer != address(0), "Invalid farmer address");
        require(msg.value > 0, "Grant amount must be greater than zero");

        farmerBalances[farmer] += msg.value;
    }

    // Admin distributes grants manually to a farmer
    function distributeGrant(
        address payable _farmer,
        uint _amount
    ) external onlyAdmin contractActive farmerExists(_farmer) {
        require(
            address(this).balance >= _amount,
            "Not enough balance in contract"
        );

        // Transfer ETH
        _farmer.transfer(_amount);

        // Update tracking
        farmers[_farmer].grantsReceived += _amount;
        totalDistributed += _amount;

        emit GrantDistributed(_farmer, _amount);
    }

    function withdrawGrant() external {
        require(!paused, "Contract is paused");
        uint256 amount = farmerBalances[msg.sender];
        require(amount > 0, "No grant available to withdraw");

        farmerBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit GrantWithdrawn(msg.sender, amount);
    }

    // Admin can pause/unpause the contract
    function pauseContract(bool _state) external onlyAdmin {
        paused = _state;
        emit ContractPaused(_state);
    }

    // View contract balance
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    // View farmer grant details
    function getFarmerDetails(
        address _farmer
    ) public view returns (bool isRegistered, uint grantsReceived) {
        Farmer memory farmer = farmers[_farmer];
        return (farmer.isRegistered, farmer.grantsReceived);
    }
}
