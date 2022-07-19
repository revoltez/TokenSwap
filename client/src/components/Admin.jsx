import React,{useEffect, useState} from 'react'
import TokenSwap from "../contracts/TokenSwap.json";

export default function Admin({Web3,Contracts,Accounts,TokenSwapAddress}) {
    const [ratio, setRatio] = useState(0);
    const [numOfTokenA, setNumOfTokenA] = useState(0);
    const [numOfTokenX, setNumOfTokenX] = useState(0);
    const [fees, setFees]= useState(0);
    const [tokenABalance, setTokenABalance] = useState(0);
    const [tokenXBalance, setTokenXBalance] = useState(0);
    const [abcTokenPrice, setabcTokenPrice] = useState(0);
    const [xyzTokenPrice, setXyzTokenPrice] = useState(0);

    const updateBalance=async()=>
    {
        const result = await Contracts[1].methods.balanceOf(TokenSwapAddress).call();
        setTokenABalance(parseInt(result));

        const result2 = await Contracts[2].methods.balanceOf(TokenSwapAddress).call();
        setTokenXBalance(parseInt(result2));
    }

    //Run only once
    useEffect(async ()=>
    {
        updateBalance();
        
        await Contracts[1].events.Transfer({fromBlock:0, filter:
            {_from:Accounts[0],_to:TokenSwapAddress}},(error,event) =>
        {
            updateBalance();
        });
        await Contracts[2].events.Transfer({fromBlock:0, filter:
            {_from:Accounts[0],_to:TokenSwapAddress}},(error,event) =>
        {
            updateBalance();
        });

        const abcPrice = await Contracts[1].methods.tokenPrice().call();
        setabcTokenPrice(abcPrice)
        const xyzPrice= await Contracts[2].methods.tokenPrice().call();
        setXyzTokenPrice(xyzPrice);

        const result = await Contracts[0].methods.getRatio().call();
        setRatio(result);
        const result2 = await Contracts[0].methods.getFees().call();
        setFees(result2);

    },[]);


    const  buyTokensABC = async ()=>
    {
        await Contracts[0].methods.buyTokensABC(numOfTokenA).send({from:Accounts[0],value:abcTokenPrice*numOfTokenA});
    } 
    const buyTokensXYZ = async ()=>
    {
        await Contracts[0].methods.buyTokensXYZ(numOfTokenX).send({from:Accounts[0],value:xyzTokenPrice*numOfTokenX});
    }
    const changeFees= async ()=>
    {
        await Contracts[0].methods.setFees(fees).send({from:Accounts[0]});
        const result = await Contracts[0].methods.getFees().call();
        setFees(result);
    }

    const changeRatio =async ()=>
    {
        await Contracts[0].methods.setRatio(ratio).send({from:Accounts[0]});
        const result = await  Contracts[0].methods.getRatio().call();
        setRatio(result);  
    }


    return (
        <div class="container">
        <div class="mt-2 d-flex justify-content-center align-items-center navbar rounded bg-warning ">
<p class="h2 text-white">Admin panel</p></div>
        <label class="mt-2 alert alert-info">fees: {fees}%</label> 
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
