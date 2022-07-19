const TokenSwap = artifacts.require("./TokenSwap.sol");
const TokenA = artifacts.require("./TokenABC.sol");
const TokenX = artifacts.require("./TokenXYZ.sol");

contract("TokenSwap", (accounts) => {
  it("testing the swapTKA function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenXInstance = await TokenX.deployed();

    await TokenSwapInstance.tokenABC.call();
    await TokenSwapInstance.buyTokensABC(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });
    await TokenSwapInstance.buyTokensXYZ(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });

    await TokenSwapInstance.setRatio(3);
    await TokenSwapInstance.setFees(30);

    // need to buy tokenABC
    await TokenAInstance.buyTokens(10, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });

    // approve the smart contract to withdraw amount of tokens that is going to be exchanged
    // and test the allowanceValue before and after the approval
    await TokenAInstance.approve(TokenSwapInstance.address, 5);

    let allowanceValue = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValue, 5);

    await TokenSwapInstance.swapTKA(5, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValueAfter, 0);

    const balanceOfX = await TokenXInstance.balanceOf(
      TokenSwapInstance.address
    );
    assert.equal(balanceOfX, 989);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    assert.equal(balanceOfA, 1005);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKX = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(balanceTKA, 5);
    assert.equal(balanceTKX, 11);
  });

  it("testing the swapTKX function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenXInstance = await TokenX.deployed();

    const ratio = await TokenSwapInstance.setRatio(3);

    const checkPre = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(checkPre, 11);
    // approve the smart contract to withdraw amount of tokens that is going to be exchanged
    // and test the allowanceValue before and after the approval
    await TokenXInstance.approve(TokenSwapInstance.address, 10);

    let allowanceValue = await TokenXInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValue, 10);

    await TokenSwapInstance.swapTKX(10, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValueAfter, 0);

    const balanceOfX = await TokenXInstance.balanceOf(
      TokenSwapInstance.address
    );
    assert.equal(balanceOfX, 999);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    assert.equal(balanceOfA, 1002);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKX = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(balanceTKA, 8);
    assert.equal(balanceTKX, 1);
  });
});
