import React,{useEffect, useState} from 'react'
import TokenSwap from "../contracts/TokenSwap.json";

export default function Admin({Web3,Contracts,Accounts}) {
    const [ratio, setRatio] = useState(0);
    const [numOfTokenA, setNumOfTokenA] = useState(0);
    const [numOfTokenX, setNumOfTokenX] = useState(0);
    const [fees, setFees]= useState(0);
    const [TokenSwapAddress, setTokenSwapAddress] = useState(0);
    const [tokenABalance, setTokenABalance] = useState(0);
    const [tokenXBalance, setTokenXBalance] = useState(0);
    const [abcTokenPrice, setabcTokenPrice] = useState(0);
    const [xyzTokenPrice, setXyzTokenPrice] = useState(0);

    let web3 =  Web3;        
    let accounts= Accounts;
    let contracts = Contracts;
    let networkId;
    let deployedNetworkTokenSwap;

    const updateBalance=async()=>
    {
        console.log("deployeNetworkAddress: ",deployedNetworkTokenSwap.address);
        const result = await contracts[1].methods.balanceOf(deployedNetworkTokenSwap.address).call();
        setTokenABalance(parseInt(result));

        const result2 = await contracts[2].methods.balanceOf(deployedNetworkTokenSwap.address).call();
        setTokenXBalance(parseInt(result2));
    }

    //Run only once
    useEffect(async ()=>
    {
        networkId = await web3.eth.net.getId();
        deployedNetworkTokenSwap = TokenSwap.networks[networkId];
        setTokenSwapAddress(deployedNetworkTokenSwap.address);
        updateBalance();
        
        const receipt = await contracts[1].events.Transfer({fromBlock:0, filter:
            {_from:accounts[0],_to:deployedNetworkTokenSwap.address}},(error,event) =>
        {
            updateBalance();
        });
        const receipt2 = await contracts[2].events.Transfer({fromBlock:0, filter:
            {_from:accounts[0],_to:deployedNetworkTokenSwap.address}},(error,event) =>
        {
            updateBalance();
        });

        const abcPrice = await contracts[1].methods.tokenPrice().call();
        setabcTokenPrice(abcPrice)
        const xyzPrice= await contracts[2].methods.tokenPrice().call();
        setXyzTokenPrice(xyzPrice);

        const result = await contracts[0].methods.getRatio().call();
        setRatio(result);
        const result2 = await contracts[0].methods.getFees().call();
        setFees(result2);

    },[]);


    const  buyTokensABC = async ()=>
    {
        const receipt = await contracts[0].methods.buyTokensABC(numOfTokenA).send({from:accounts[0],value:abcTokenPrice*numOfTokenA});
    } 
    const buyTokensXYZ = async ()=>
    {
        const receipt = await contracts[0].methods.buyTokensXYZ(numOfTokenX).send({from:accounts[0],value:xyzTokenPrice*numOfTokenX});
    }
    const changeFees= async ()=>
    {
        const receipt = await contracts[0].methods.setFees(fees).send({from:accounts[0]});
        const result = await contracts[0].methods.getFees().call();
        setFees(result);
    }

    const changeRatio =async ()=>
    {
        const receipt = await contracts[0].methods.setRatio(ratio).send({from:accounts[0]});
        const result = await  contracts[0].methods.getRatio().call();
        setRatio(result);  
    }


    return (
        <div class="container">
        <h1 class="text-center">Admin panel</h1>
        <label class="mt-1 alert alert-info">fees: {fees}%</label> 
        <div class="input-group">
           <input type="number"  class="text-center form-control" placeholder="Fees" min="1" onChange={(evt)=>{setFees(evt.target.value)}}></input>
           <button class="btn-primary form-control" onClick={()=>{changeFees()}}>Set Fees</button> 
        </div>

           <br></br>

        <label class ="alert alert-info">Ratio: {ratio}</label>
        <div class="input-group">
           <input type="number"  class="text-center form-control" placeholder="Ratio" onChange={(evt)=>{setRatio(evt.target.value)}}></input>
           <button class="btn-primary form-control" onClick={()=>{changeRatio()}}>Set Ratio</button> 
        </div>
<br></br>
        <label class="alert alert-info">Tokens ABC bought:{tokenABalance}</label>
        <div class="input-group">
           <input type="number"  class="text-center form-control" max="5000" placeholder="Amount" onChange={(evt)=>{setNumOfTokenA(evt.target.value)}}></input>
           <button class="btn-danger form-control" onClick={()=>{buyTokensABC()}}>Buy TokenABC</button> 
        </div>
           <br></br>
        <label class="alert alert-info">Tokens XYZ bought:{tokenXBalance}</label>   
        <div class="input-group">
           <input type="number"  class="text-center form-control" placeholder="Amount" onChange={(evt)=>{setNumOfTokenX(evt.target.value)}}></input>
           <button class="btn-danger form-control" onClick={()=>{buyTokensXYZ()}}>Buy TokenXYZ</button> 
        </div>
        </div>
    )
}
