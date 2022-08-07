pragma solidity ^0.8.15;

contract HotDog {
    uint public availableHotDogs = 10;

    event HotDogEaten(
        uint numberEaten
    );

    event HotDogCooked(
        uint numberCooked
    );
    
    function getHotDogs(uint _order) public returns(uint){
        availableHotDogs = availableHotDogs - _order;
        emit HotDogEaten(_order);
        return availableHotDogs;
    }
    
    function cookHotDogs(uint _target) public returns(uint){
        availableHotDogs = availableHotDogs + _target;
        emit HotDogCooked(_target);
        return availableHotDogs;
    }
}