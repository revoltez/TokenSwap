const TokenABC = artifacts.require("./TokenABC.sol");

contract("TokenABC", (accounts) => {
  it("Testing the initial supply", async () => {
    const TokenInstance = await TokenABC.deployed();
    const result = await TokenInstance.totalSupply.call();
    assert.equal(1000000 * 10 ** 18, result);
  });
});
