import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { getAllCoinAddresses } from '../components/utils/crypto';

const Login = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const words = mnemonic.trim().split(/\s+/).filter(word => word.length > 0);
      
      if (words.length !== 12) {
        toast.error('Please enter exactly 12 words in your recovery phrase');
        return;
      }
      
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      // Validate the mnemonic first
      if (!bip39.validateMnemonic(mnemonic, wordlist)) {
        toast.error('Invalid recovery phrase. Please check your words.');
        return;
      }

      // Encrypt and store the mnemonic
      const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
      localStorage.setItem("wallet_encrypted_key", encrypted);

      // Generate and store addresses
      const addresses = await getAllCoinAddresses(mnemonic);
      localStorage.setItem("wallet_logged_in", "true");
      localStorage.setItem("wallet_addresses", JSON.stringify(addresses));

      toast.success("Wallet restored successfully!", { position: "top-center" });
      navigate('/dashboard');
    } catch (error) {
      console.error('Restoration error:', error);
      toast.error('Failed to restore wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (value) => {
    setPassword(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const length = value.length;

    if (length < 6) {
      setPasswordStrength('Weak');
    } else if (length < 10 || !(hasNumber && hasSpecialChar)) {
      setPasswordStrength('Good');
    } else {
      setPasswordStrength('Strong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />
      
      <header className="py-8 px-6 border-b border-gray-800 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </button>
        <h1 className="text-xl font-bold ml-3 bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
          Import Wallet
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-900/20 rounded-full mb-4">
                <Lock className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Restore Your Wallet</h2>
              <p className="text-gray-400">Enter your 12-word recovery phrase</p>
            </div>

            <div className="mb-6">
              <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-300 mb-2">
                Recovery Phrase
              </label>
              <textarea
                id="mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white placeholder-gray-500 resize-none"
                placeholder="Enter your 12-word phrase separated by spaces"
                spellCheck="false"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-2">
                {mnemonic.trim() === '' ? 0 : mnemonic.trim().split(/\s+/).filter(word => word.length > 0).length}/12 words
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white placeholder-gray-500"
                  placeholder="Enter your wallet password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Password Strength:</span>
                    <span className={
                      passwordStrength === 'Weak' ? 'text-red-400' :
                      passwordStrength === 'Good' ? 'text-yellow-400' :
                      'text-green-400'
                    }>
                      {passwordStrength}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 'Weak' ? 'bg-red-500 w-1/3' :
                        passwordStrength === 'Good' ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!mnemonic || !password || isLoading}
              className={`w-full px-6 py-3 rounded-xl font-medium transition flex items-center justify-center ${
                (!mnemonic || !password || isLoading) 
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Restoring...
                </>
              ) : (
                'Restore Wallet'
              )}
            </button>

            <div className="flex items-start p-3 bg-yellow-900/20 rounded-xl mt-6 border border-yellow-700/30">
              <div className="p-1 bg-yellow-900/50 rounded-full mr-2">
                <Lock className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-sm text-yellow-300">
                Never share your recovery phrase. Anyone with this phrase can access your funds.
              </span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;