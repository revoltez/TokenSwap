# TokenSwap

Token swap smart contract that swaps two ERC20 tokens and takes a fee

[![](https://img.shields.io/badge/Donate-yellow?style=for-the-badge)](https://www.patreon.com/free_college)

# 
![TokenSwap](https://user-images.githubusercontent.com/24751547/140658739-c6c999c0-e3c8-4250-a34c-d755ea9801f9.png)

# Test

Open Ganache and run the following commands :

```
truffle migrate
truffle test
```

- in case you want to publish to the testnet dont Forget to add .secret file and put the seed of metamask account in it. for more informations : https://docs.binance.org/smart-chain/developer/deploy/truffle.html

# Run

you need to modify the Admin address in App.js to get the Admin panel and charge the TokenSwap Smart contract and then run the following comand

```
npm install
cd Client
yarn install
yarn start
```

- add the Admin account in your wallet, the TokenSwap will detect changes and redirect you to the Admin component
  you need to charge the smart Contract with Tokens XYZ and ABC and set the Ratio and the Fee
- make sure to configure Metamask to whichever network you migrated to when you ran the `truffle migarte ` command,this repository is already configured to connect to the testnet.
