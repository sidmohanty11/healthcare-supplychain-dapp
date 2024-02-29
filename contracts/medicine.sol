// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicineContract {
    struct Medicine {
        bytes32 id;
        string name;
        string location;
        address owner;
        uint batch_no;
    }
    mapping(bytes32 => Medicine) public medicines;
    
    event MedicineAdded(bytes32 indexed id, string name, string location, address indexed owner, uint batch_no);
    event MedicineBought(bytes32 indexed id, address indexed previousOwner, address indexed newOwner, string newLocation);
    
    function addMedicine(string memory _name, string memory _location, address _owner, uint _batch_no) public returns(bytes32) {
        bytes32 id = keccak256(abi.encodePacked(_name, _location, _owner, _batch_no));
        require(medicines[id].id == bytes32(0), "Medicine already exists");
        
        Medicine memory newMedicine = Medicine(id, _name, _location, _owner, _batch_no);
        medicines[id] = newMedicine;
        
        emit MedicineAdded(id, _name, _location, _owner, _batch_no);
        
        return id;
    }
    
    function buyMedicine(bytes32 _id, address _newOwner, string memory _newLocation) public payable {
        require(msg.value > 0, "Payment required to buy medicine");
        require(medicines[_id].id != bytes32(0), "Medicine does not exist");
        require(medicines[_id].owner != _newOwner, "You already own this medicine");
        
        address payable previousOwner = payable(medicines[_id].owner);
        previousOwner.transfer(msg.value);
        
        medicines[_id].owner = _newOwner;
        medicines[_id].location = _newLocation;
        
        emit MedicineBought(_id, medicines[_id].owner, _newOwner, _newLocation);
    }
    
    function locateMedicine(bytes32 _id) public view returns(string memory) {
        require(medicines[_id].id != bytes32(0), "Medicine does not exist");
        return medicines[_id].location;
    }
    
    function getMedicineInfo(bytes32 _id) public view returns(string memory, string memory, address, uint) {
        require(medicines[_id].id != bytes32(0), "Medicine does not exist");
        return (medicines[_id].name, medicines[_id].location, medicines[_id].owner, medicines[_id].batch_no);
    }
}
