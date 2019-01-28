var Migrations = artifacts.require("./Greetingsv1.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
