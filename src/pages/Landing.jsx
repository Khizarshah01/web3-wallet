import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Import } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    const encrypted = localStorage.getItem("wallet_encrypted_key");
    if (encrypted) {
      navigate("/verify-password");
    }
    const timer = setTimeout(() => {
      setAnimationLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      <header className="py-8 px-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Web3 Wallet
          </h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className={`transform transition-transform duration-1000 ${
          animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        } text-center mb-12`}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Your Gateway to Web3
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            A secure, non-custodial wallet for managing your crypto assets with complete control and privacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          <div 
            className={`transform transition-all duration-700 ${
              animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex flex-col items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl hover:shadow-indigo-500/10 transition-all">
              <div className="rounded-full p-4 bg-gradient-to-br from-emerald-400 to-teal-500 mb-6 shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Create New Wallet</h3>
              <p className="text-gray-400 text-center mb-6">
                Generate a new secure wallet with a recovery phrase.
              </p>
              <button 
                onClick={() => navigate('/create')}
                className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                Create Wallet
              </button>
            </div>
          </div>

          <div 
            className={`transform transition-all duration-700 ${
              animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex flex-col items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl hover:shadow-indigo-500/10 transition-all">
              <div className="rounded-full p-4 bg-gradient-to-br from-indigo-400 to-purple-500 mb-6 shadow-lg">
                <Import className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Import Wallet</h3>
              <p className="text-gray-400 text-center mb-6">
                Restore your wallet using a recovery phrase.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Import Wallet
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-gray-500 border-t border-gray-800">
        <p className="text-sm">Web3 Wallet © {new Date().getFullYear()} - Your keys, your crypto</p>
      </footer>
    </div>
  );
};

export default Landing;