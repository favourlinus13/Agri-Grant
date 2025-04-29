import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../blockchain/contractABI.json';
import CONTRACT_ADDRESS from "../blockchain/contractAddress";
import { Link } from 'react-router-dom';


function HomePage() {
  const [contract, setContract] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setupProviderAndContract = async () => {
      try {
        // Create a read-only provider (from MetaMask, or fallback to default RPC)
        let provider;
        if (window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
          // fallback if user doesn't have MetaMask (optional)
          provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli'); // example using Goerli
        }

        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
        setContract(tempContract);
      } catch (error) {
        console.error('Failed to create provider or contract', error);
      }
    };

    setupProviderAndContract();
  }, []);

  useEffect(() => {
    if (!contract) return;

    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const farmerAddresses = await contract.getAllFarmers();
        const farmersData = await Promise.all(
          farmerAddresses.map(async (address) => {
            const balance = await contract.farmerBalances(address);
            return {
              address,
              balance: ethers.utils.formatEther(balance),
            };
          })
        );

        setFarmers(farmersData);
        localStorage.setItem('registeredFarmers', JSON.stringify(farmersData));
      } catch (err) {
        console.error('Error fetching farmers:', err);
      }
      setLoading(false);
    };

    // Load from localStorage first
    const saved = localStorage.getItem('registeredFarmers');
    if (saved) {
      setFarmers(JSON.parse(saved));
    }

    fetchFarmers();

    // Listen for new farmer registrations
    contract.on("FarmerRegistered", (farmerAddress) => {
      fetchFarmers();
    });

    // Cleanup listener
    return () => {
      contract.removeAllListeners("FarmerRegistered");
    };
  }, [contract]);



  return (
    <>
      <div className="text-center mb-5">
        <h1 style={{ color: '#606c38' }}>AgriGrant Distribution</h1>
        <p style={{ color: '#283618' }}>Transparent Distribution of Government Agricultural Grants</p>
        <div className="d-grid gap-2 col-6 mx-auto mt-5" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link to="/admin" className="btn border-0 btn-primary btn-lg" style={{ backgroundColor: '#283618' }}>Govt Dashboard</Link>
          <Link to="/farmer" className="btn border-0 btn-success btn-lg" style={{ backgroundColor: '#283618' }}>Farmer Dashboard</Link>
        </div>
      </div>

      <div className="container mt-5 ">
        <h2 className="mt-5 mb-3" style={{ color: '#606c38' }}>Registered Farmers</h2>

        {loading ? (
          <div className="text-center my-3">
            <div className="spinner-border" role="status" />
          </div>
        ) : farmers.length === 0 ? (
          <p style={{ color: '#606c38' }}>No farmers registered yet.</p>
        ) : (
          <table className="table mt-3">
            <thead>
              <tr>
                <th style={{ color: '#283618' }}>Farmer Address</th>
                <th style={{ color: '#283618' }}>Awarded Grant (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer, index) => (
                <tr key={index} >
                  <td>{farmer.address.slice(0, 9)}....{farmer.address.slice(-5)}</td>
                  <td>{farmer.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default HomePage;
