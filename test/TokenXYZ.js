const TokenXYZ = artifacts.require("./TokenXYZ.sol");

contract("TokenXYZ", (accounts) => {
  it("Testing the XYZ Token price", async () => {
    const TokenInstance = await TokenXYZ.deployed();
    const result = await TokenInstance.totalSupply.call();
    assert.equal(1000000, result);
  });
});
