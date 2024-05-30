
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";


export default function HomePage() {

  const [balance, setBalance] = useState(undefined);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [message, setMessage] = useState("");
  const [showAccount, setShowAccount] = useState(true);
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;


  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }
  };


  const handleAccount = async () => {
    const accounts = await ethWallet.listAccounts();
    setAccount(accounts[0]);
  };


  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }


    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      handleAccount();
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };


  const getATMContract = async () => {
    if (ethWallet) {
      const signer = ethWallet.getSigner();
      const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
      setATM(atmContract);
    }
  };


  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };


  const deposit = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit(1);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }
  };


  const withdraw = async () => {
    if (atm) {
      try {
        const tx = await atm.withdraw(1);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error withdrawing:", error);
      }
    }
  };


  const sendETH = async () => {
    if (ethWallet && recipientAddress && amountToSend) {
      try {
        const signer = ethWallet.getSigner();
        const tx = await signer.sendTransaction({
          to: recipientAddress,
          value: ethers.utils.parseEther(amountToSend),
        });
        await tx.wait();
        setMessage("Transfer complete");
      } catch (error) {
        console.error("Error sending ETH:", error);
        setMessage("Transfer failed");
      }
    } else {
      setMessage("Please enter a valid address and amount");
    }
  };


  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };


  const handleAmountToSendChange = (event) => {
    setAmountToSend(event.target.value);
  };


  const toggleAccountVisibility = () => {
    setShowAccount(!showAccount); // Toggle the visibility state
  };


  useEffect(() => {
    getWallet();
  }, []);


  useEffect(() => {
    if (ethWallet) {
      handleAccount();
      getATMContract();
    }
  }, [ethWallet]);


  useEffect(() => {
    getBalance();
  }, [atm]);


  return (
    <main className="container">
      <header>
        <h1>Hello! <br /> <span style={{ color: '#4000ff' }}>Welcome to ATM</span></h1>
      </header>
      {account ? (
        <div>
          <button onClick={toggleAccountVisibility} style={{ backgroundColor: '#267bd9', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
            {showAccount ? "CLOSE ACCOUNT" : "OPEN ACCOUNT"}
          </button>
          {showAccount ? (
            <div>
              <h1 style={{ color: 'blue' }}>Your Account: {account}</h1>
            </div>

          ) : null}
          <p>Your Balance: <span style={{ fontSize: '1.8em' }}>{balance}</span> ETH</p>
          <button onClick={deposit} style={{ backgroundColor: '#29d69c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', marginRight: '10px' }}>Deposit 1 ETH</button>
          <button onClick={withdraw} style={{ backgroundColor: '#ff6347', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Withdraw 1 ETH</button>
          <div>
            ------------------------------------------------------------------
            <br></br>
          </div>
          <div>
          <br></br>
            <label>
              Receiver Address:
              <input type="text" value={recipientAddress} onChange={handleRecipientAddressChange} />
            </label>
            <br></br>
            <br></br>
            <label>
              Amount:
              <input type="text" value={amountToSend} onChange={handleAmountToSendChange} />
            </label>
            <br></br>
            <br></br>
            <button onClick={deposit} style={{ backgroundColor: '#29d69c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', marginRight: '10px' }}>SEND ETH</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      ) : (
        <button onClick={connectAccount}>Please, can you connect your Metamask wallet?</button>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
