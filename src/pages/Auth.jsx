import React, { useState } from 'react';
import * as bip39 from '@scure/bip39';
import CryptoJS from 'crypto-js';
import { wordlist } from '@scure/bip39/wordlists/english';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getAllCoinAddresses } from '../components/utils/crypto';
import 'react-toastify/dist/ReactToastify.css';
import { RiResetRightFill } from "react-icons/ri";

const Auth = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const encrypted = localStorage.getItem("wallet_encrypted_key");

    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

      if (bip39.validateMnemonic(decrypted, wordlist)) {
        console.log("Valid mnemonic");
        const addresses = await getAllCoinAddresses(decrypted);

        localStorage.setItem("wallet_logged_in", "true");
        localStorage.setItem("wallet_addresses", JSON.stringify(addresses));

        toast.success("Login successful!", { position: "top-center" });
        navigate("/dashboard");
      } else {
        toast.error("Invalid password ^M", { position: "top-center" });
      }
    } catch (error) {
      toast.error(`Invalid Password ^W ${error}`, { position: "top-center" });
    }
  };

  const handleReset = () => {
    localStorage.clear();
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 relative">
      <ToastContainer theme="dark" />
      <form 
        onSubmit={handleLogin} 
        className="bg-neutral-900 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-sm"
      >
        <h2 className="text-white text-2xl font-semibold text-center">Wallet Login</h2>
        
        <div>
          <label htmlFor="password" className="block text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition font-semibold"
        >
          Submit
        </button>
      </form>

      {/* Reset logo button in bottom-left corner */}
      <div 
        onClick={handleReset} 
        className="absolute bottom-4 left-4 cursor-pointer text-gray-500 hover:text-white transition"
      >
        <RiResetRightFill className="h-6 w-6 text-white" />
      </div>
    </div>
  );
};

export default Auth;
