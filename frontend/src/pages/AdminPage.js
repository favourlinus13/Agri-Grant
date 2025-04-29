import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../blockchain/contractABI.json';
import WalletConnect from '../components/WalletConnect';
import LoadingButton from '../components/LoadingButton';
import { Alert } from 'react-bootstrap';
import CONTRACT_ADDRESS from "../blockchain/contractAddress.js";


function AdminPage() {
    const [farmerAddress, setFarmerAddress] = useState('');
    const [grantAmount, setGrantAmount] = useState('');
    const [pauseState, setPauseState] = useState(false);
    const [signer, setSigner] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false);


    const contract = signer ? new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer) : null;

    const showAlert = (message, variant = "success") => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 4000);
    };

    const registerFarmer = async () => {
        if (!signer) return showAlert("Connect Wallet first!");
        setLoading(true)
        try {
            const tx = await contract.registerFarmer(farmerAddress);
            await tx.wait();
            showAlert('Farmer Registered!');
        } catch (error) {
            showAlert('Error Registering Farmer, Farmer might be already registered');
            console.error(error.data.message);
        }
        setLoading(false)
    };

    const depositFunds = async () => {
        if (!signer) return showAlert("Connect Wallet first!");
        setLoading(true)
        try {
            // const tx = await signer.sendTransaction({
            //     to: farmerAddress,
            //     value: ethers.utils.parseEther(grantAmount),
            // });
            // await tx.wait();
            await contract.sendGrant(farmerAddress, { value: ethers.utils.parseEther(grantAmount) });
            showAlert('Grant successfully sent!');
        } catch (error) {
            showAlert("Error Depositing Funds")
            console.error(error.data)
        }
        setLoading(false)
    };


    const togglePause = async () => {
        if (!signer) return showAlert("Connect Wallet first!");
        setLoading(true)
        try {
            const tx = await contract.pauseContract(pauseState);
            await tx.wait()
            showAlert(`Contract state is now ${pauseState}`);
        } catch (error) {
            showAlert("Error toggling")
            console.error(error)
        }
        setLoading(false)
    };

    return (
        <div className="container w-75">
            <WalletConnect setSigner={setSigner} />
            {alert.show && (
                <Alert variant={alert.variant}>
                    {alert.message}
                </Alert>
            )}
            <h2 className='mt-5 mb-3' style={{ color: '#606c38' }}>Govt Dashboard</h2>

            <div className="mb-3">
                <label>Farmer Address:</label>
                <input type="text" className="form-control custom-input" value={farmerAddress} onChange={(e) => setFarmerAddress(e.target.value)} />
            </div>

            <div className="mb-3">
                <label>Amount (in ETH):</label>
                <input type="text" className="form-control custom-input" value={grantAmount} onChange={(e) => setGrantAmount(e.target.value)} />
            </div>

            <div className="d-grid gap-3">
                <LoadingButton loading={loading} onClick={registerFarmer} className="border-0" >
                    Register Farmer
                </LoadingButton>

                <LoadingButton loading={loading} onClick={depositFunds} className="border-0">
                    Distribute Grant
                </LoadingButton>

                {/* <LoadingButton loading={loading} onClick={distributeGrant} className="btn-warning">
                    Distribute Grant
                </LoadingButton> */}

                <LoadingButton loading={loading} onClick={() => { setPauseState(!pauseState); togglePause(); }} className="border-0">
                    {pauseState ? "Unpause Contract" : "Pause Contract"}
                </LoadingButton>

            </div>
        </div>
    );
}

export default AdminPage;
