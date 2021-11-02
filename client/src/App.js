import React, { Component, useState, useEffect } from "react";
import TokenSwap from "./contracts/TokenSwap.json";
import TokenABC from "./contracts/TokenABC.json";
import TokenXYZ from "./contracts/TokenXYZ.json";
import getWeb3 from "./getWeb3";
import Admin from "./components/Admin";
import TokenSwapScreen from "./components/TokenSwapScreen";
import "./App.css";

function App() {
  const [web3, setweb3] = useState(null);
  const [accounts, setaccounts] = useState([]);
  const [networkId, setNetworId] = useState(null);
  const [deployedNetwork, setDeployedNetwork] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [demands, setDemands] = useState(null);
  const [fees, setFees] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        //shoudl check wether metamsk is connected to the desired network or not, if not ask the user to sitch networks

        // Use web3 to get the user's accounts.
        const metaMaskAccounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        const deployedNetworkTokenSwap = TokenSwap.networks[networkId];
        const deployedNetworkTokenABC = TokenABC.networks[networkId];
        const deployedNetworkTokenXYZ = TokenXYZ.networks[networkId];

        const instance = new web3.eth.Contract(
          TokenSwap.abi,
          deployedNetworkTokenSwap && deployedNetworkTokenSwap.address
        );

        const instance2 = new web3.eth.Contract(
          TokenABC.abi,
          deployedNetworkTokenABC && deployedNetworkTokenABC.address
        );
        const instance3 = new web3.eth.Contract(
          TokenXYZ.abi,
          deployedNetworkTokenXYZ && deployedNetworkTokenXYZ.address
        );

        const arr = [instance, instance2, instance3];

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        setweb3(web3);
        setDeployedNetwork(deployedNetwork);
        setaccounts(metaMaskAccounts);
        setNetworId(networkId);
        setContracts(arr);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      window.ethereum.on("accountsChanged", async (accounts) => {
        console.log("accountsChanges", accounts);
        setaccounts(accounts);
        window.location.reload();
      });
    };
    if (web3 && accounts) {
      load();
    }
  }, [web3, contracts, accounts]);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  if (web3 && accounts && contracts) {
    if (accounts[0] === "0xc6dcEA3CE50DD198B230be79b30394a88e0A622a") {
      return (
        <Admin Web3={web3} Contracts={contracts} Accounts={accounts}></Admin>
      );
    } else {
      console.log("contracts from app");
      console.log(contracts);
      return (
        <TokenSwapScreen
          Web3={web3}
          Contracts={contracts}
          Accounts={accounts}
        ></TokenSwapScreen>
      );
    }
  }

  return <div className="App"></div>;
}

export default App;
