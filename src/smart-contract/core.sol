// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract LandRegistrar {
    struct userStruct {
        string name;
        address wallet;
        bool isRegistered;
    }

    struct landStruct {
        uint256 landId;
        string location;
        uint256 price;
        address owner;
        uint256 area;
        bool isForSale;
        address bidder;
        uint256 bidPrice;
        string isApprovedByInspector;
        uint256 timestamp;
    }

    struct userTxnStruct {
        uint256 landId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 timestamp;
    }

    struct inspectorTxnStruct {
        uint256 landId;
        address inspector;
        address buyer;
        address seller;
        uint256 amount;
        bool isApproved;
        uint256 timestamp;
    }

    mapping(address => userStruct) public users;
    mapping(address => landStruct) public landsOfUser;
    mapping(uint256 => landStruct) public allLands;
    mapping(uint256 => userTxnStruct) public userTxns;
    mapping(uint256 => inspectorTxnStruct) public inspectorTxns;

    uint256 public landCount = 0;
    uint256 public userTxnCount = 0;
    uint256 public insTxnCount = 0;

    function registerUser(string memory _name) public {
        // Check if user is already registered
        require(
            users[msg.sender].isRegistered == false,
            "User is already registered."
        );

        // Add user to mapping
        users[msg.sender] = userStruct({
            name: _name,
            wallet: msg.sender,
            isRegistered: true
        });
    }

    function loginUser() public view returns (bool) {
        // Check if user is registered
        return users[msg.sender].isRegistered;
    }

    function addNewLand(
        string memory _location,
        uint256 _price,
        uint256 _area
    ) public {
        landCount += 1;

        // Add the land to the lands mapping
        allLands[landCount] = landStruct({
            landId: landCount,
            location: _location,
            price: _price,
            owner: msg.sender,
            area: _area,
            isForSale: false,
            bidder: address(0),
            bidPrice: 0,
            isApprovedByInspector: "notforsale",
            timestamp: block.timestamp
        });

        landsOfUser[msg.sender] = landStruct({
            landId: landCount,
            location: _location,
            price: _price,
            owner: msg.sender,
            area: _area,
            isForSale: false,
            bidder: address(0),
            bidPrice: 0,
            isApprovedByInspector: "notforsale",
            timestamp: block.timestamp
        });
    }

    function withdrawSale(uint256 _landId) public {
        allLands[_landId].isForSale = false;
        allLands[_landId].bidPrice = 0;
        allLands[_landId].isApprovedByInspector = "notforsale";
    }

    function postLandForSaleNew(
        string memory _location,
        uint256 _price,
        uint256 _bidPrice,
        uint256 _area
    ) public {
        landCount += 1;

        // Add the land to the lands mapping
        allLands[landCount] = landStruct({
            landId: landCount,
            location: _location,
            price: _price,
            owner: msg.sender,
            area: _area,
            isForSale: true,
            bidder: address(0),
            bidPrice: _bidPrice,
            isApprovedByInspector: "nobid",
            timestamp: block.timestamp
        });

        landsOfUser[msg.sender] = landStruct({
            landId: landCount,
            location: _location,
            price: _price,
            owner: msg.sender,
            area: _area,
            isForSale: true,
            bidder: address(0),
            bidPrice: _bidPrice,
            isApprovedByInspector: "nobid",
            timestamp: block.timestamp
        });
    }

    function postLandForSale(uint256 _landId, uint256 _bidPrice) public {
        allLands[_landId].isForSale = true;
        allLands[_landId].bidPrice = _bidPrice;
        allLands[_landId].isApprovedByInspector = "nobid";

    }

    function buyLand(uint256 _landId, address _inspector) public payable {
        allLands[_landId].isForSale = false;
        allLands[_landId].bidder = msg.sender;
        allLands[_landId].isApprovedByInspector = "waiting";

        payable(_inspector).transfer(msg.value);
    }

    function approveLand(uint256 _landId, bool _approveOrDeny) public payable {
        insTxnCount += 1;
        inspectorTxns[insTxnCount].landId = _landId;
        inspectorTxns[insTxnCount].inspector = msg.sender;
        inspectorTxns[insTxnCount].buyer = allLands[_landId].bidder;
        inspectorTxns[insTxnCount].seller = allLands[_landId].owner;
        inspectorTxns[insTxnCount].amount = allLands[_landId].bidPrice;
        inspectorTxns[insTxnCount].isApproved = _approveOrDeny;
        inspectorTxns[insTxnCount].timestamp = block.timestamp;

        if (_approveOrDeny) {
            userTxnCount += 1;

            userTxns[userTxnCount].landId = _landId;
            userTxns[userTxnCount].buyer = allLands[_landId].bidder;
            userTxns[userTxnCount].seller = allLands[_landId].owner;
            userTxns[userTxnCount].amount = allLands[_landId].bidPrice;
            userTxns[userTxnCount].timestamp = block.timestamp;

            payable(allLands[_landId].owner).transfer(msg.value);

            allLands[_landId].isApprovedByInspector = "done";
            allLands[_landId].owner = allLands[_landId].bidder;
            allLands[_landId].bidder = address(0);
            allLands[_landId].price = allLands[_landId].bidPrice;
            allLands[_landId].bidPrice = 0;
        } else {
            payable(allLands[_landId].bidder).transfer(msg.value);

            allLands[_landId].isApprovedByInspector = "done";
            allLands[_landId].bidder = address(0);
            allLands[_landId].bidPrice = 0;

        }
    }
}
