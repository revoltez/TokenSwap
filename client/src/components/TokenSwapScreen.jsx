import React,{useState,useEffect} from 'react'
import TokenSwap from "../contracts/TokenSwap.json";

export default function TokenSwapScreen({Web3,Contracts,Accounts,TokenSwapAddress}) {

const [tokenSelected, setTokenSelected] = useState("ABC");
const [switchAmount, setSwitchAmount] = useState(0);
const [numOfTokenA, setNumOfTokenA] = useState(0);
const [numOfTokenX, setNumOfTokenX] = useState(0);
const [tokenABalance, setTokenABalance] = useState(0);
const [tokenXBalance, setTokenXBalance] = useState(0);
const [fees, setFees] = useState(0);
const [ratio, setRatio] = useState(0);
const [finalAmount, setFinalAmount] = useState(0);
const [abcTokenPrice, setabcTokenPrice] = useState(0);
const [xyzTokenPrice, setXyzTokenPrice] = useState(0);

const web3 =Web3;
let contracts = Contracts;
let accounts= Accounts;
    //Run only once
    useEffect(async ()=>
    {        
        updateBalance();
        const result = await contracts[0].methods.getFees().call();
        setFees(result);
        const result2 = await contracts[0].methods.getRatio().call();
        setRatio(result2);
        
        await contracts[1].events.Transfer({fromBlock:0, filter:
            {_from:accounts[0],_to:accounts[0]}},async (error,event) =>
        {
            updateBalance();
        });
        await contracts[2].events.Transfer({fromBlock:0, filter:
        {_from:accounts[0],_to:accounts[0]}},async (error,event) =>
        {
            updateBalance();
        });

    },[]);

    useEffect(()=>{
        calculateSwap();
    },[switchAmount])

    const updateBalance=async()=>
    {
            const result = await contracts[1].methods.balanceOf(accounts[0]).call();
            setTokenABalance(parseInt(result));

            const result2 = await contracts[2].methods.balanceOf(accounts[0]).call();
            setTokenXBalance(parseInt(result2));

            const abcPrice = await contracts[1].methods.tokenPrice().call();
            setabcTokenPrice(abcPrice)
            const xyzPrice= await contracts[2].methods.tokenPrice().call();
            setXyzTokenPrice(xyzPrice);
    }

    const swapTokens = async()=>
    {
        if(finalAmount>0)
        {
            if(tokenSelected ==="ABC")
            {
                await contracts[1].methods.approve(TokenSwapAddress,switchAmount).send({from:accounts[0]});
                await contracts[0].methods.swapTKA(switchAmount).send({from:accounts[0]}); 
            }
            else
            {
                await contracts[2].methods.approve(TokenSwapAddress,switchAmount).send({from:accounts[0]});
                await contracts[0].methods.swapTKX(switchAmount).send({from:accounts[0]});   
            }
        }else{alert("Cant switch Tokens with Expected return less then zero")}
    }

    const  buyTokensABC = async (amount)=>
    {
        try
        {
            await contracts[1].methods.buyTokens(amount).send({from:accounts[0],value:amount*abcTokenPrice});
        }
        catch(err)
        {
            alert("Transaction Failed due to the following Error"+err);
        }
    }

    const buyTokensXYZ = async (amount)=>
    {
        try
        {
            await contracts[2].methods.buyTokens(amount).send({from:accounts[0],value:amount*xyzTokenPrice});
        }
        catch(err)
        {
            alert("Transaction Failed due to the following Error"+err);
        }
    }

const calculateSwap=()=>
{
    let Final;
    if(tokenSelected==="ABC")
   {
        const exchangeA= parseInt(switchAmount) * parseInt(ratio);
        Final= exchangeA - ((exchangeA * fees)/100);
    }
    else
    {
        const exchangeA = switchAmount / ratio;
        Final = exchangeA-((exchangeA *fees)/100);
    }
    if(isNaN(Final))
    {
        setFinalAmount(0);
    }else
    {
        setFinalAmount(Math.ceil(Final));
    }
}

    return (
        <div class="container mt-5">
        <nav class ="navbar navbar-expand-lg navbar-light bg-dark rounded-3 ">
            <div class="container-fluid">
            <h1 class="text-light">TokenSwap</h1>
            <label class="badge bg-primary fs-4 rounded">TokenABC Balance: {tokenABalance} Tokens</label>
            <label class="badge bg-primary fs-4 rounded">TokenXYZ Balance: {tokenXBalance} Tokens</label>
            </div>
        </nav>
        <form onSubmit={(evt)=>
            {
                evt.preventDefault();
                buyTokensABC( evt.target.tkABC.value);
                evt.target.tkABC.value="";
            }}>
            <div class="d-flex mt-3 input-group">
                <input class="form-control border" placeholder="Amount" name="tkABC" type="number" onChange={(evt)=>{setNumOfTokenA(evt.target.value)}} ></input>
                <button class="btn-danger text-center form-control" type="submit">buy Token ABC</button>
                </div>
        </form>
        
        <form onSubmit={(evt)=>
            {
                evt.preventDefault();
                buyTokensXYZ(evt.target.tkXYZ.value);
                evt.target.tkXYZ.value="";
            }}>
            <div class="d-flex mt-3 input-group">
                <input class="form-control" type="number" placeholder="Amount" name="tkXYZ" onChange={(evt)=>{setNumOfTokenX(evt.target.value)}} ></input>
                <button class="btn-danger text-center form-control" type="submit">buy Token XYZ</button>
            </div>
        </form>
            <div class="input-group mt-3">
                <select onChange={(evt)=>{
                    setTokenSelected(evt.target.value)
                    }} class="form-select text-center" aria-label="Value">
                    <option value="ABC">switch TokenABC with Token XYZ</option>
                    <option value="XYZ">switch Token XYZ with Token ABC</option>
                </select>
            </div>
            <div class="input-group mt-5">
            <input class="form-control" placeholder="Amount" type="number" onChange={(evt)=>{setSwitchAmount(evt.target.value)}} ></input>
            <button class="btn-warning form-control" onClick={()=>{swapTokens()}}>Swap</button>
            </div>    
            <label class="alert alert-info mt-3">1 ABC = {ratio} XYZ, Fees: {fees}%  Expected to get:{finalAmount}</label>
        </div>
    )
}


