import React, { useState } from 'react';
import * as bip39 from '@scure/bip39';
import CryptoJS from 'crypto-js';
import { wordlist } from '@scure/bip39/wordlists/english';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getAllCoinAddresses } from '../components/utils/crypto';
import 'react-toastify/dist/ReactToastify.css';
import { RiRestartLine } from "react-icons/ri";

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
        toast.error("Invalid password", { position: "top-center" });
      }
    } catch (error) {
      toast.error(`Invalid Password`, { position: "top-center" });
    }
  };

  const handleReset = () => {
    localStorage.clear();
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black relative">
      <ToastContainer 
        theme="dark"
        toastClassName="bg-gray-800 border border-gray-700"
        progressClassName="bg-indigo-500"
      />
      
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-900/20 rounded-full mb-4">
              <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Wallet Login</h2>
            <p className="text-gray-400">Enter your password to access your wallet</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
                placeholder="Enter your wallet password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${!password ? 'bg-indigo-900/50 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20'}`}
              disabled={!password}
            >
              Unlock Wallet
            </button>
          </form>
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="absolute bottom-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        title="Reset Wallet"
      >
        <div className="p-2 bg-gray-800/50 rounded-full group-hover:bg-indigo-900/30 transition-colors">
          <RiRestartLine className="h-5 w-5" />
        </div>
        <span className="text-sm hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">
          Reset Wallet
        </span>
      </button>
    </div>
  );
};

export default Auth;