import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../blockchain/contractABI.json';
import WalletConnect from '../components/WalletConnect';
import { Alert } from 'react-bootstrap';
import CONTRACT_ADDRESS from "../blockchain/contractAddress.js";


function FarmerPage() {
    const [signer, setSigner] = useState(null);
    const [grantBalance, setGrantBalance] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("?");

    const contract = signer ? new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer) : null;


    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 4000);
    };


    const checkMyGrant = async () => {
        if (!signer) return showAlert("Connect Wallet first!");
        setLoading(true);
        try {
            const address = await signer.getAddress();
            const balance = await contract.getFarmerBalance(address);
            setGrantBalance(ethers.utils.formatEther(balance));
            showAlert('Grant fetched successfully!');
        } catch (error) {
            console.error(error);
            showAlert('Error fetching grant', 'danger');
        }
        setLoading(false);
    };

    const fetchDetails = async () => {
        try {
            const address = await signer.getAddress();
            const details = await contract.getFarmerDetails(address);
            if (details[0]) {
                setValue("Registered")
            } else {
                setValue("Unregistered")
            }
        } catch (error) {
            showAlert("Connect Wallet")
        }
    };

    const withdrawGrant = async () => {
        if (!signer) return showAlert("Connect Wallet first!");
        setLoading(true);
        try {
            const tx = await contract.withdrawGrant();
            await tx.wait();
            showAlert('Grant withdrawn successfully!');
            setGrantBalance(null); // Reset balance after withdrawal
        } catch (error) {
            console.error(error);
            showAlert('Error withdrawing grant');
        }
        setLoading(false);
    };

    return (
        <div className="container w-75">
            <WalletConnect setSigner={setSigner} />

            <h2 className='mt-5 mb-3' style={{ color: '#606c38' }}>Farmer Dashboard</h2>

            {alert.show && (
                <Alert variant={alert.variant}>
                    {alert.message}
                </Alert>
            )}

            <div className="d-grid gap-2 my-3">
                <button className="btn btn-primary border-0" style={{ backgroundColor: '#283618' }} onClick={checkMyGrant} disabled={loading}>
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        'Check My Grant'
                    )}
                </button>

                <div className="mt-5">
                    <button className="btn border-0 btn-info mb-3" style={{ backgroundColor: '#606c38', color: '#fefae0' }} onClick={() => { fetchDetails() }}>Check your Status</button>
                    <h6 style={{ color: '#606c38' }}>Status: <span style={{ color: '#bc6c25' }}>{value}</span></h6>
                </div>

                {grantBalance !== null && (
                    <>
                        <div className="alert alert-info mt-4 border-0" style={{ backgroundColor: '#dda15e', color: '#fefae0' }}>
                            Your Available Grant: <strong>{grantBalance} ETH</strong>
                        </div>
                        <button className="btn btn-success border-0" style={{ backgroundColor: '#283618' }} onClick={withdrawGrant} disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                'Withdraw Grant'
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default FarmerPage;
