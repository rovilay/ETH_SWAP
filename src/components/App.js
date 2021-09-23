import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Navbar from './Navbar';
import './App.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [token, setToken] = useState({});
  const [tokenBalance, setTokenBalance] = useState('0');
  const [ethSwap, setEthSwap] = useState({});
  const [ethBalance, setEthBalance] = useState('0');

  useEffect(() =>{
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    if (!web3) return;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0] || account);

    if (!accounts[0]) return;

    const balance = await web3.eth.getBalance(accounts[0]);
    setEthBalance(balance || ethBalance);

    // Load Token
    const networkId =  await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];

    if(!tokenData) {
      window.alert('Token contract not deployed to detected network.');
      return;
    }

    const tk = new web3.eth.Contract(Token.abi, tokenData.address);
    const tkBalance = await tk.methods.balanceOf(accounts[0]).call();

    setToken(tk);
    setTokenBalance(tkBalance.toString());

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];

    if(!ethSwapData) {
      window.alert('Token contract not deployed to detected network.');
      return;
    }

    const es = new web3.eth.Contract(ethSwapData.abi, ethSwapData.address);
    const esBalance = await tk.methods.balanceOf(accounts[0]).call();

    setEthSwap(es);
    // setEthBalance(esBalance.toString());
  }

  const loadWeb3 = async() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Hello world</h1>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
