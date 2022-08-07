const HotDogContract = artifacts.require("HotDog");

module.exports = function(deployer) {
  deployer.deploy(HotDogContract);
};
