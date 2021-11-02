var TokenABC = artifacts.require("./TokenABC.sol");
var TokenXYZ = artifacts.require("./TokenXYZ.sol");
var TokenSwap = artifacts.require("./TokenSwap.sol");

module.exports = async function (deployer) {
  const TokenA = await deployer.deploy(TokenABC, 1000000, 1000);
  const TokenB = await deployer.deploy(TokenXYZ, 1000000, 1000);
  return deployer.deploy(TokenSwap, TokenABC.address, TokenXYZ.address);
};
