import React, { useState } from 'react';
import { ethers } from 'ethers';

function WalletConnect({ setSigner }) {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask to use this app!");
    }
  };


  return (
    <div className="mb-3 text-end">
      {walletAddress ? (
        <span className="li badge border-0" style={{ backgroundColor: '#606c38' }}>
          Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
        </span>
      ) : (
        <button className="btn btn-primary border-0" style={{ backgroundColor: '#606c38' }} onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnect;
