// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracking {
    enum ShipmentStatus {PENDING, IN_TRANSIT, DELIVERED}

    struct Shipment {
        address sender;
        address reciever;
        uint256 pickupTime;
        string senderName;
        string receiverName;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }
    

    mapping(address => Shipment[]) public shipments;
    uint256 public shipmentCount;

    struct TypeShipment{
        address sender;
        address reciever;
        uint256 pickupTime;
        string senderName;
        string receiverName;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    TypeShipment[] typeshipments;

    event ShipmentCreated(address indexed sender,address indexed reciever,uint256 pickupTime,string senderName, string receiverName,uint256 distance,uint256 price);
    event ShipmentInTransit(address indexed sender,address indexed reciever,uint256 pickupTime);
    event ShipmentDelivered(address indexed sender,address indexed reciever,uint256 deliveryTime);
    event ShipmentPaid(address indexed sender,address indexed reciever,uint256 amount);
    constructor() {
        shipmentCount=0;
    }

    function createShipment(address _reciever,uint256 _pickupTime,string memory _senderName,string memory _receiverName,uint256 _distance,uint256 _price) public payable{
        require(msg.value == _price, "Payment amount must match the amount.");
        
        Shipment memory shipment = Shipment(msg.sender,_reciever,_pickupTime,_senderName,_receiverName,0,_distance,_price,ShipmentStatus.PENDING,false); 

        shipments[msg.sender].push(shipment);
        shipmentCount++;

        typeshipments.push(
            TypeShipment(msg.sender,_reciever,_pickupTime,_senderName,_receiverName,0,_distance,_price,ShipmentStatus.PENDING,false)
        );

        emit ShipmentCreated(msg.sender,_reciever,_pickupTime,_senderName,_receiverName,_distance,_price);
    }

    function startShipment(address _sender,address _reciever,uint256 _index) public{
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeShipment = typeshipments[_index];

        require(shipment.reciever == _reciever, "Invalid Reciever.");
        require(shipment.status == ShipmentStatus.PENDING, "Shipment already in Transit.");
        
        shipment.status = ShipmentStatus.IN_TRANSIT;
        typeShipment.status = ShipmentStatus.IN_TRANSIT;

        emit ShipmentInTransit(_sender,_reciever,shipment.pickupTime);
    
    }

    function CompleteShipment(address _sender,address _receiver,uint256 _index) public{
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeshipment = typeshipments[_index];

        require(shipment.reciever == _receiver , "Invalid reciever.");
        require(shipment.status == ShipmentStatus.IN_TRANSIT, "Shipment not in transit");
        require(!shipment.isPaid, "Shipment already Paid");

        shipment.status = ShipmentStatus.DELIVERED;
        typeshipment.status = ShipmentStatus.DELIVERED;
        typeshipment.deliveryTime = block.timestamp;
        shipment.deliveryTime = block.timestamp;

        uint256 amount = shipment.price;

        payable(shipment.sender).transfer(amount);

        shipment.isPaid = true;
        typeshipment.isPaid=true;

        emit ShipmentDelivered(_sender,_receiver,shipment.deliveryTime);
        emit ShipmentPaid(_sender,_receiver,amount);
    }

    function getShipment(address _sender,uint256 _index) public view returns (
        address, address, uint256,string memory,string memory,uint256, uint256, uint256, ShipmentStatus, bool)
        {
         Shipment memory shipment = shipments[_sender][_index];
         return (shipment.sender,shipment.reciever,shipment.pickupTime,shipment.senderName,shipment.receiverName,shipment.deliveryTime,shipment.distance,shipment.price,shipment.status,shipment.isPaid);
        }

        function getBalance() public view returns (uint256){
            return address(this).balance;
        }

    function getShipmentCount(address _sender) public view returns (uint256){
        return shipments[_sender].length;
    }
    
    function getAllTranscations() public view returns (TypeShipment[] memory){
        return typeshipments;
    }  
   
}