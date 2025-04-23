import React, { useState } from 'react';
import * as bip39 from '@scure/bip39';
import CryptoJS from 'crypto-js';
import { wordlist } from '@scure/bip39/wordlists/english';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Buffer } from 'buffer';
import { HDKey } from '@scure/bip32';
import { getAllCoinAddresses } from '../utils/crypto';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    const encrypted = localStorage.getItem("wallet_encrypted_key");

    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

      if (bip39.validateMnemonic(decrypted, wordlist)) {
        console.log("Valid mnemonic");
        
        // STEP 1: Derive public addresses
        console.log(decrypted);
        const addresses = await getAllCoinAddresses(decrypted);
       
        localStorage.setItem("wallet_logged_in", "true");
        localStorage.setItem("wallet_addresses", JSON.stringify(addresses));
        // console.log(localStorage.getItem("wallet_addresses"));
        
        // STEP 3: Navigate to dashboard
        toast.success("Login successful!", { position: "top-center" });
        // console.log(addresses);
        navigate("/dashboard");
      }
       else {  
        toast.error("Invalid password ^M", { position: "top-center" }); // ^M encrypted mneomonic
      }
    } catch (error) {
      toast.error(`Invalid Password ^W ${error}`, { position: "top-center" }); // ^W wrong passw
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer />
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-sm">
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Auth;
