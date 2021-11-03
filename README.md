# TokenSwap
Token swap smart contract that swaps two ERC20 tokens and takes a fee
# Test
run the following commands :
```
truffle migrate
truffle test
```
in case you want to publish in the testnet dont Forget to add .secret file and put the seed of metamask account in it, for more informations : https://docs.binance.org/smart-chain/developer/deploy/truffle.html
# Run 
you need to modify the Admin address in App.js to get the Admin panel and charge the TokenSwap Smart contract and then run the following comand
```
yarn install
yarn start
```
add the Admin account in your wallet, the TokenSwap will detect changes and redirect you to the Admin component
you need to charge the smart Contract with Tokens XYZ and ABC and set the Ratio and the Fee
